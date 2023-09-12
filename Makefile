COMPOSE := docker compose

VOLUMES := $(shell docker volume ls -q)

COMPILED := backend/mount/dist \
			backend/mount/node_modules \
			frontend/mount/build \
			frontend/mount/node_modules

BACKEND_SHARED := backend/mount/src/shared
FRONTEND_SHARED := frontend/mount/src/shared
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
	rm -rf $(SHARED)
	cp -r shared $(BACKEND_SHARED)
	cp -r shared $(FRONTEND_SHARED)

.PHONY: build down clean re revolume shared