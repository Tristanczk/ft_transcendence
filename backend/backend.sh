#!/bin/sh

npm install
npx prisma generate

echo "BEFORE PRISMA MIGRATE"

while true; do
	npx prisma migrate deploy
	EXIT_CODE=$?
	echo "PRISMA EXIT CODE: $EXIT_CODE"

	if [ $EXIT_CODE -eq 0 ]; then
		break
	fi
done

npm run start:dev 
