FROM node:20.11.0

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

WORKDIR /build
COPY package.json /build/package.json

RUN npm install
COPY . /build/
RUN npm run build

EXPOSE 80
CMD npm run start:prod
