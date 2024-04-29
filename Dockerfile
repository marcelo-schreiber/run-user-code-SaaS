FROM node:lts

RUN apt-get update && \
    apt-get install -y docker.io 

WORKDIR /app

COPY package*.json /app

RUN npm install

COPY . .

EXPOSE 3000

# Add Docker socket volume
VOLUME /var/run/docker.sock /var/run/docker.sock

CMD ["npm", "start"]