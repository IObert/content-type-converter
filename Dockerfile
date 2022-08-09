FROM node:18-alpine

WORKDIR /usr

COPY package.json ./
COPY tsconfig.json ./
COPY src ./src

RUN yarn
RUN yarn build

COPY dist ./dist

EXPOSE 8080
CMD ["yarn","start"]