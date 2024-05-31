FROM node:lts-alpine

RUN mkdir /images
WORKDIR /images

COPY package.json .
RUN npm i

COPY src src
COPY tsconfig.json .

CMD npm run start