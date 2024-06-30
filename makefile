define HELPTEXT
	Usage: make COMMAND
	
	Commands:
		all		Config & Start all applications.
		dev		Run development api server.
		db-init		Start postgres container and init data.
		
endef
export HELPTEXT

help:
	@echo "$$HELPTEXT"

db-init:
	docker compose up -d

dev:
	bun dev

bun:
	npm install -g bun

turbo:
	npm install turbo --global

install:
	bun install

all: bun turbo install db-init dev