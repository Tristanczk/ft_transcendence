FROM node:18-alpine

# TODO change to production before deployment
ENV NODE_ENV=development

RUN mkdir -p /frontend
WORKDIR /frontend

EXPOSE 3000

COPY ./frontend.sh /frontend.sh
RUN chmod 755 /frontend.sh
ENTRYPOINT ["/frontend.sh"]