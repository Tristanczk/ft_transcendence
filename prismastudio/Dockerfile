FROM node:18-alpine

# TODO change to production before deployment
ENV NODE_ENV=development

RUN mkdir -p /prismastudio
WORKDIR /prismastudio

EXPOSE 5555

COPY ./prismastudio.sh /prismastudio.sh
RUN chmod 755 /prismastudio.sh
ENTRYPOINT ["/prismastudio.sh"]
