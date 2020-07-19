FROM node:slim
RUN npm install nodemon
COPY . /opt/app/
WORKDIR /opt/app/
CMD ["npm","start"]