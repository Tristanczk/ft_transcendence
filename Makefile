COMPOSE 	:= docker compose
VOLUMES		:= $(shell docker volume ls -q)
COMPILED	:= backend/mount/dist backend/mount/node_modules frontend/mount/build frontend/mount/node_modules

build:
	$(COMPOSE) up --build

ps:
	$(COMPOSE) ps

stop:
	$(COMPOSE) stop

logs:
	$(COMPOSE) logs -f

down:
	$(COMPOSE) down -v

clean: down
	rm -rf $(COMPILED)
	docker system prune -f -a --volumes

re: clean
	$(MAKE) build

rmvolumes: down
	if [ -n "$(VOLUMES)" ]; then docker volume rm -f $(VOLUMES); fi

revolume: rmvolumes
	$(MAKE) build
