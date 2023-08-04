FROM node:18-alpine

# TODO change to production at the end
ENV NODE_ENV=development

RUN mkdir -p /frontend
WORKDIR /frontend

# same logic, we use the layered cache of docker to avoid reinstalling the dependencies
COPY package*.json ./

RUN npm install


COPY . .


EXPOSE 3000

# TODO need to change the command to build the production version at the end
RUN chmod 755 /frontend/frontend.sh
ENTRYPOINT ["/frontend/frontend.sh"]