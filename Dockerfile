FROM node:16.17.0

COPY /package.json /build/package.json
COPY /package-lock.json /build/package-lock.json
WORKDIR /build
RUN npm install
COPY / /build/

EXPOSE 80
CMD npm run start
