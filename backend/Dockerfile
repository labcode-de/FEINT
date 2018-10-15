FROM node:10
MAINTAINER Leo Maroni (LabCode) <hello@labcode.de>
WORKDIR /app
ADD package.json .
RUN npm i -g nodemon
EXPOSE 4000
CMD nodemon index.js