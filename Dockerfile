FROM node:lts

RUN apt-get update && \
    apt-get install -y docker.io 

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

EXPOSE 3000

CMD ["npm", "start"]