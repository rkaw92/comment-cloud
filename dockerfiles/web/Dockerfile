FROM node:10-stretch
COPY . /srv/comment-cloud
WORKDIR /srv/comment-cloud
RUN npm ci
# Variables for generating the ToS document:
ARG DATA_CONTROLLER_IDENT
ARG DATA_CONTROLLER_CONTACT
ARG DATA_PROCESSING_LOCATION
RUN npm run build-ui
RUN npm run build-tos

CMD node src/runnables/web.js
EXPOSE 3000
