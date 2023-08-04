#!/bin/sh

export DB_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dev-db:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

npm install
npx prisma generate

while true; do
	npx prisma migrate deploy
	EXIT_CODE=$?
	echo "PRISMA EXIT CODE: $EXIT_CODE"
	if [ $EXIT_CODE -eq 0 ]; then
		break
	fi
done

npm run start:dev 
