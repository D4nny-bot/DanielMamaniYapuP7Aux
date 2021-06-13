FROM node
RUN mkdir -p opt/app
WORKDIR /opt/app
COPY package.json .
RUN npm install --quiet
RUN npm install nodemon -g --quiet
RUN npm install typescript -g --quiet
RUN npm isntall express --quiet
RUN npm install ts-node --quiet
COPY . .
EXPOSE 8000
CMD ["nodemon", "dist/server.js"]