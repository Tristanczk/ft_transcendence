FROM node:18-alpine

# TODO change to production at the end
ENV NODE_ENV=development

RUN mkdir -p /backend
WORKDIR /backend

# at this point we only need to copy the package.json and package-lock.json 
# as well as the prisma folder to install the dependencies through npm install
# we take advantage of the docker cached layers in order not to reinstall the dependencies
# every time we change the code but only when we make modifications to the package.json or prisma files
COPY package*.json ./
COPY prisma ./prisma/

RUN npm install

# the node modules are ignored through the .dockerignore file in order to avoir 
# rewriting the downloaded dependencies
COPY . .

RUN npx prisma generate

# doesn't work because it can't access the database
# RUN npx prisma migrate dev --name init

EXPOSE 3333

# TODO need to change the start:dev to start:prod at the end
CMD ["npm", "run", "start:dev"]