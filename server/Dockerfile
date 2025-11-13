FROM node:18-alpine AS base
WORKDIR /app

COPY package*.json ./
RUN npm install --production

COPY src ./src

EXPOSE 8787
CMD ["node", "src/server.js"]
