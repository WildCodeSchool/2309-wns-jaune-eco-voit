FROM node:lts-alpine

WORKDIR /app

COPY package.json package.json

RUN npm i
RUN apk --update --no-cache add curl

COPY ../src src

COPY ../tsconfig.json tsconfig.json
COPY ../tailwind.config.ts tailwind.config.ts
COPY ../postcss.config.js postcss.config.js
COPY ../codegen.ts codegen.ts

COPY ../next.config.mjs next.config.mjs 

CMD PORT=3003 npm run dev  & npm run generate