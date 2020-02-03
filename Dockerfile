FROM keymetrics/pm2:latest-slim

COPY app.js .
COPY api api/
COPY package.json .
COPY .env .

RUN npm install

CMD [ "pm2-runtime", "start", "app.js" ]