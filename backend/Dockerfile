FROM node:18-alpine

ENV NODE_ENV=development

RUN mkdir -p /backend
WORKDIR /backend

EXPOSE 3333

COPY ./backend.sh /backend.sh
RUN chmod 755 /backend.sh
ENTRYPOINT ["/backend.sh"]