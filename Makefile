COMPOSE := docker compose
VOLUMES	:= $(shell docker volume ls -q)

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
	docker system prune -f -a --volumes

re: clean
	$(MAKE) build

rmvolumes: down
	if [ -n "$(VOLUMES)" ]; then docker volume rm -f $(VOLUMES); fi

revolume:
	$(MAKE) rmvolumes
	$(MAKE) build
