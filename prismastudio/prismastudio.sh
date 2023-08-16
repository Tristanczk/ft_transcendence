
#!/bin/sh

export DB_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dev-db:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

npm install
npx prisma generate

echo $DB_URL

npx prisma studio
