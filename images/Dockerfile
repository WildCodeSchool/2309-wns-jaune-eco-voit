FROM node:lts-alpine

RUN mkdir /images
WORKDIR /images

COPY package.json .
RUN npm i

COPY src src
COPY uploads uploads
COPY tsconfig.json .

CMD npm run start