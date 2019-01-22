FROM node:10-stretch
COPY . /srv/comment-cloud
WORKDIR /srv/comment-cloud
RUN npm ci

CMD node src/runnables/web.js
EXPOSE 3000
