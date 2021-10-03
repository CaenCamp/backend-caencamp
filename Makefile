.PHONY: install start stop log

CURRENT_UID=$(id -u):$(id -g)
export CURRENT_UID ?= $(shell id -u):$(shell id -g)
export NODE_ENV ?= development

DOCKER := docker run --rm -v ${PWD}:/app -u=${CURRENT_UID} -w /app node:14-alpine

help: ## Display available commands
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

# ===============================================================
# Dockerized Database ===========================================
# ===============================================================

db-start: ## start PostgreSQL in Docker Compose
	docker-compose up -d

db-stop: ## stop Docker Compose PG
	docker-compose down

db-logs: ## Display pg logs from Docker Compose
	docker-compose logs -f

db-init: ## Create dump and replace the last one. Environment must be started
	docker-compose exec postgres bash -ci 'psql -U backend-local-user --file /db-init/initdb.sql cc_backend_db'

db-dump: ## Create dump and replace the last one. Environment must be started
	docker-compose exec postgres bash -ci 'pg_dump -U backend-local-user cc_backend_db > /db-dump/backend.sql'


# =====================================================================
# Initialization ======================================================
# =====================================================================

install: ## Install all js deps
	npm install
	cd apps/admin && npm install
	cd apps/api && npm install


# =====================================================================
# ADR - Architecture Decision Records =================================
# =====================================================================

adr-new: ## Create new ADR
	@if [ "$(title)" = "" ]; then \
		echo 'Vous devez déclarer un titre'; \
		echo 'Exemple: make adr-new title="New Team Decision"'; \
		exit 1; \
	fi
	@${DOCKER} yarn adr:new "${title}"

adr-list: ## List all ADR
	@${DOCKER} yarn adr:list

# =====================================================================
# Build ===============================================================
# =====================================================================

build: ## Build the front
	rm -rf apps/api/admin/*
	cd apps/admin && npm run build
	cp -R apps/admin/build/* apps/api/admin/
