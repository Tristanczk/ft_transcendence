COMPOSE := docker compose

VOLUMES := $(shell docker volume ls -q)

COMPILED := backend/mount/dist \
			backend/mount/node_modules \
			frontend/mount/build \
			frontend/mount/node_modules

BACKEND_SHARED := backend/mount/src/shared.ts
FRONTEND_SHARED := frontend/mount/src/shared.ts
SHARED := $(BACKEND_SHARED) $(FRONTEND_SHARED)

build: shared
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

clean: down
	docker system prune -f -a --volumes
	rm -rf $(COMPILED) $(SHARED)

re: clean
	$(MAKE) build

revolume: down
	if [ -n "$(VOLUMES)" ]; then docker volume rm -f $(VOLUMES); fi
	$(MAKE) build

shared:
	cp shared.ts $(BACKEND_SHARED)
	cp shared.ts $(FRONTEND_SHARED)

.PHONY: build down clean re revolume shared