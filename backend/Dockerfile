FROM node:18-alpine

# TODO change to production before deployment
ENV NODE_ENV=production

RUN mkdir -p /backend
WORKDIR /backend

EXPOSE 3333

COPY ./backend.sh /backend.sh
RUN chmod 755 /backend.sh
ENTRYPOINT ["/backend.sh"]
