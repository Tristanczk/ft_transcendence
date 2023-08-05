COMPOSE 	:= docker compose
VOLUMES		:= $(shell docker volume ls -q)
COMPILED	:= backend/mount/dist \
               backend/mount/node_modules \
			   frontend/mount/build \
			   frontend/mount/node_modules

build:
	$(COMPOSE) up --build

down:
	$(COMPOSE) down -v

clean: down
	docker system prune -f -a --volumes
	rm -rf $(COMPILED)

re: clean
	$(MAKE) build

revolume: down
	if [ -n "$(VOLUMES)" ]; then docker volume rm -f $(VOLUMES); fi
	$(MAKE) build

.PHONY: build down clean re revolume