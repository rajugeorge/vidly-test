FROM node:alpine

RUN apk add --no-cache make gcc g++ python3 py3-pip

WORKDIR /app

COPY ./package.json .
RUN npm install
COPY . .

EXPOSE 3000
CMD ["npm", "start"]