FROM node:20.11.0

ARG GIT_COMMIT
ENV GIT_COMMIT=$GIT_COMMIT

COPY /package.json /build/package.json
COPY /package-lock.json /build/package-lock.json
WORKDIR /build
RUN npm install
COPY / /build/
RUN npm run build

EXPOSE 80
CMD npm run start:prod
