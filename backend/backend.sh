#!/bin/sh

export DB_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@dev-db:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public"

npm install
npx prisma generate

echo "-----Migrating database-----"

while true; do
	echo "-----Migrating database try-----"
	# uncomment to reset database if error when using migrate dev (especially if columns have been deleted with values still in the db)
	npx prisma migrate reset --force 
	npx prisma migrate dev --name init
	EXIT_CODE=$?
	echo "PRISMA EXIT CODE: $EXIT_CODE"
	if [ $EXIT_CODE -eq 0 ]; then
		break
	fi
done

echo "-----Starting backend-----"

npm run start:dev 
