COMPOSE := docker compose

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