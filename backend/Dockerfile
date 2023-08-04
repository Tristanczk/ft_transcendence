FROM node:18-alpine

# TODO change to production at the end
ENV NODE_ENV=development

RUN mkdir -p /backend
WORKDIR /backend

EXPOSE 3333

# TODO need to change the start:dev to start:prod at the end
COPY ./backend.sh /backend.sh
RUN chmod 755 /backend.sh
ENTRYPOINT ["/backend.sh"]