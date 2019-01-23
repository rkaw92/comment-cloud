FROM node:10-stretch
COPY . /srv/comment-cloud
WORKDIR /srv/comment-cloud
RUN npm ci
RUN npm run build-ui

CMD node src/runnables/web.js
EXPOSE 3000
