FROM node:20.11.0

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

WORKDIR /build
COPY package.json /build/package.json
COPY package-lock.json /build/package-lock.json

RUN npm install
COPY . /build/

# 刪除 .env
RUN rm -f .env
RUN rm -f docker/.env
RUN rm -f sh/.env

RUN npm run build

EXPOSE 80
CMD npm run start:prod
