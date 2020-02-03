const AssistantV2 = require('ibm-watson/assistant/v2');
const {
    IamAuthenticator
} = require('ibm-watson/auth');
const dotenv = require('dotenv');
dotenv.config();

const assistant = new AssistantV2({
    version: '2019-02-28',
    authenticator: new IamAuthenticator({
        apikey: process.env.ASSISTANT_APIKEY
    }),
    url: process.env.ASSISTANT_URL,
});

const assistantId = process.env.ASSISTANT_ID;
const assistantName = 'Watson';

const createSession = async () => {
    let result;
    try {
        await assistant.createSession({
                assistantId: process.env.ASSISTANT_ID
            })
            .then(res => result = res)
    } catch (error) {
        result = error;
    }
    return result;
}

const sendMessage = async (sessionId, messageText) => {
    let result;
    try {
        if (sessionId) {
            await assistant.message({
                    assistantId: process.env.ASSISTANT_ID,
                    sessionId: sessionId,
                    input: {
                        'message_type': 'text',
                        'text': messageText
                    }
                })
                .then(res => result = res);
        }
    } catch (error) {
        result = error;
    }
    return result;
}

exports.assistantId = assistantId;
exports.assistantName = assistantName;
exports.createSession = createSession;
exports.sendMessage = sendMessage;