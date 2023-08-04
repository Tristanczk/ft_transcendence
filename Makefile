COMPOSE := docker compose
VOLUMES	:= $(shell docker volume ls -q)
OUTPUT	:= backend/dist backend/node_modules frontend/build frontend/node_modules

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
	rm -rf $(OUTPUT)
	docker system prune -f -a --volumes

re: clean
	$(MAKE) build

rmvolumes: down
	if [ -n "$(VOLUMES)" ]; then docker volume rm -f $(VOLUMES); fi

revolume:
	$(MAKE) rmvolumes
	$(MAKE) build
