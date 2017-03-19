FROM node:4-onbuild

RUN npm install -g gulp gulp-cli

ONBUILD COPY *.js /usr/src/app
ONBUILD COPY *.json /usr/src/app

ONBUILD COPY conf /usr/src/app/conf
ONBUILD COPY dist /usr/src/app/dist
ONBUILD COPY gulp_tasks /usr/src/app/gulp_tasks
ONBUILD COPY typings  /usr/src/app/typings

CMD ["gulp","serve"]

EXPOSE 3000
