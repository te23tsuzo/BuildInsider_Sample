FROM node:4-onbuild

RUN mkdir -p /usr/src/app/config
RUN npm install -g gulp gulp-cli

ONBUILD COPY *.js /usr/src/app
ONBUILD COPY config/* /usr/src/app/config

CMD ["gulp","start"]

EXPOSE 8080
