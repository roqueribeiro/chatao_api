'use strict';

var moment = require('moment');
const watson = require('../watson/asyncMethods');

let onlineUsers = [];

module.exports = async (io) => {
    io.on('connection', async (socket) => {

        let checkUserInList = onlineUsers.filter((e) => e.socketId === socket.id);
        if (checkUserInList.length === 0)
            onlineUsers.push({
                socketId: socket.id
            });

        socket.on('online', async () => {
            io.emit('online', onlineUsers);
        });

        socket.on('disconnect', async () => {
            let disconnectUser = onlineUsers.filter((e) => e.socketId === socket.id);
            disconnectUser.map((e) => {
                onlineUsers.find((item, i) => {
                    if (item) {
                        onlineUsers.splice(i, 1);
                        io.emit('online', onlineUsers);
                    }
                });
            });
        });

        socket.on('data', async (data) => {
            let checkUserInList = onlineUsers.filter((e) => e.socketId === socket.id)
            if (data.event === 'enterInChat') {
                if (checkUserInList.length > 0) {
                    let sessionInfo = await watson.createSession();
                    checkUserInList.map((e) => {
                        e.id = data.id,
                            e.sessionId = sessionInfo.result.session_id,
                            e.socketId = socket.id,
                            e.name = data.name,
                            e.timestamp = data.timestamp
                    });
                    io.emit('online', onlineUsers);
                }
            }

            io.emit('data', data);

            if (data.event === 'sendMessage') {
                if (data.message.startsWith(':watson')) {
                    io.emit('data', {
                        id: watson.assistantId,
                        event: 'beginWriting',
                        name: watson.assistantName
                    });
                    let watsonResponse = await watson.sendMessage(checkUserInList[0].sessionId, data.message);
                    watsonResponse = watsonResponse.result.output.generic[0].text.replace(':watson', '');
                    io.emit('data', {
                        id: watson.assistantId,
                        event: 'endWriting',
                        name: watson.assistantName
                    });
                    io.emit('data', {
                        id: watson.assistantId,
                        event: 'sendMessage',
                        name: watson.assistantName,
                        message: `Para ${data.name}: ${watsonResponse}`,
                        timestamp: moment()
                    });
                }
            }
        });
    });
};