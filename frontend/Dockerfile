FROM node:18-alpine

# TODO change to production at the end
ENV NODE_ENV=development

RUN mkdir -p /frontend
WORKDIR /frontend

EXPOSE 3000

# TODO need to change the command to build the production version at the end
COPY ./frontend.sh /frontend.sh
RUN chmod 755 /frontend.sh
ENTRYPOINT ["/frontend.sh"]