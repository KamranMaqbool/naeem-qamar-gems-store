# ==============================================================================
# VIRTUOSO'S GEMS - ENTERPRISE DEVOPS MAKEFILE
# ==============================================================================
# This Makefile adheres to professional DevOps and industry security standards.
# It encapsulates Docker Compose operations, interactive shell utilities, quality
# verification, database administration, and container lifecycle maintenance.
#
# Stack: Django REST Framework (backend) + Celery + PostgreSQL + Redis,
#        React/Vite storefront (frontend) and admin panel (admin).
# ==============================================================================

# Default shell
SHELL := /bin/bash

# Docker Compose executable and general flags
DOCKER_COMPOSE := docker compose
COMPOSE_FILE   := docker-compose.yml

# Database credentials (mirrors docker-compose.yml)
DB_NAME := virtuoso_gems
DB_USER := postgres

# Colors for terminal output formatting
COLOR_RESET   := \033[0m
COLOR_CYAN    := \033[36m
COLOR_GREEN   := \033[32m
COLOR_YELLOW  := \033[33m
COLOR_BOLD    := \033[1m

.PHONY: help up up-backend build down stop start restart restart-frontend restart-admin restart-backend \
        rebuild-frontend rebuild-admin rebuild-backend logs logs-frontend logs-admin logs-backend \
        logs-celery logs-db ps top shell-backend shell-frontend shell-admin shell-db \
        shell-redis test-backend check-frontend check-admin migrate make-migration \
        seed create-superadmin collectstatic clean clean-docker purge-data

# ==============================================================================
# 📋 HELP & DOCUMENTATION (Default Target)
# ==============================================================================
help: ## Display this comprehensive DevOps menu and operational command catalog
	@echo -e "$(COLOR_BOLD)═════════════════════════════════════════════════════════════════════════$(COLOR_RESET)"
	@echo -e "$(COLOR_BOLD)               💎 VIRTUOSO'S GEMS - DOCKER CLI OPERATIONS               $(COLOR_RESET)"
	@echo -e "$(COLOR_BOLD)═════════════════════════════════════════════════════════════════════════$(COLOR_RESET)"
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z0-9_-]+:.*?## / {printf "  $(COLOR_CYAN)%-22s$(COLOR_RESET) %s\n", $$1, $$2}' $(MAKEFILE_LIST)
	@echo -e "═════════════════════════════════════════════════════════════════════════"

# ==============================================================================
# 🚀 CONTAINER LIFECYCLE MANAGEMENT
# ==============================================================================
up: ## Start ALL platform services in the background (Django, Celery, Postgres, Redis, Storefront, Admin)
	@echo -e "$(COLOR_GREEN)▶ Starting all Virtuoso's Gems services in background...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d
	@echo -e "$(COLOR_GREEN)✔ All services are booting up.$(COLOR_RESET)"
	@echo -e "  $(COLOR_CYAN)Storefront:$(COLOR_RESET)  http://localhost:5173"
	@echo -e "  $(COLOR_CYAN)Admin panel:$(COLOR_RESET) http://localhost:5174"
	@echo -e "  $(COLOR_CYAN)Backend API:$(COLOR_RESET) http://localhost:8000/api/v1/"
	@echo -e "  $(COLOR_CYAN)API docs:$(COLOR_RESET)    http://localhost:8000/api/docs/"

up-backend: ## Start ONLY backend services (Django, Celery, Postgres, Redis) for local frontend dev
	@echo -e "$(COLOR_GREEN)▶ Starting backend services in background...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up -d backend db redis celery

build: ## Rebuild and start all container images from scratch (Recommended after dependency or UI changes)
	@echo -e "$(COLOR_GREEN)▶ Building and deploying all Virtuoso's Gems container images...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up --build -d

rebuild-frontend: ## Rapidly rebuild ONLY the React/Vite storefront container without restarting backend/db
	@echo -e "$(COLOR_GREEN)▶ Rebuilding React/Vite storefront application...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up --build -d --no-deps frontend

rebuild-admin: ## Rapidly rebuild ONLY the React/Vite admin container without restarting backend/db
	@echo -e "$(COLOR_GREEN)▶ Rebuilding React/Vite admin panel application...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up --build -d --no-deps admin

rebuild-backend: ## Rapidly rebuild ONLY the Django backend and Celery worker containers
	@echo -e "$(COLOR_GREEN)▶ Rebuilding Django backend and Celery worker containers...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) up --build -d --no-deps backend celery

down: ## Gracefully shut down and remove all containers, networks, and ephemeral sockets
	@echo -e "$(COLOR_YELLOW)■ Stopping and removing all Docker containers...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down --remove-orphans

stop: ## Pause and stop active running services WITHOUT destroying containers or state
	@echo -e "$(COLOR_YELLOW)■ Stopping running container processes...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) stop

start: ## Resume previously stopped containers without re-initialization
	@echo -e "$(COLOR_GREEN)▶ Resuming stopped containers...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) start

restart: ## Perform a clean restart across all application modules and database brokers
	@echo -e "$(COLOR_YELLOW)↻ Restarting all Docker services...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) restart

restart-frontend: ## Fast-restart ONLY the React/Vite storefront container (clears runtime cache)
	@echo -e "$(COLOR_YELLOW)↻ Restarting React/Vite storefront service...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) restart frontend

restart-admin: ## Fast-restart ONLY the React/Vite admin container
	@echo -e "$(COLOR_YELLOW)↻ Restarting React/Vite admin service...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) restart admin

restart-backend: ## Fast-restart ONLY the Django backend & Celery queue workers
	@echo -e "$(COLOR_YELLOW)↻ Restarting backend and background celery workers...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) restart backend celery

# ==============================================================================
# 🔍 LOGGING & DIAGNOSTICS
# ==============================================================================
logs: ## Stream real-time colorized output logs across ALL services simultaneously
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100

logs-frontend: ## Stream live output logs from the React/Vite storefront application
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 frontend

logs-admin: ## Stream live output logs from the React/Vite admin application
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 admin

logs-backend: ## Stream live output logs from the Django server and migrations
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 backend

logs-celery: ## Stream live asynchronous task processing logs from Celery workers
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 celery

logs-db: ## Stream live database queries and connection health logs from PostgreSQL
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) logs -f --tail=100 db

ps: ## Display container health check status, running state, and network port mappings
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) ps

top: ## Display active OS system processes CPU/Memory load running inside containers
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) top

# ==============================================================================
# 🛠️ INTERACTIVE SHELL & ADMIN ACCESS
# ==============================================================================
shell-backend: ## Open an interactive bash/sh shell inside the live Django backend container
	@echo -e "$(COLOR_CYAN)🖧 Entering Django backend container terminal...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -it backend sh -c "bash || sh"

shell-frontend: ## Open an interactive sh shell inside the live React/Vite storefront container
	@echo -e "$(COLOR_CYAN)🖧 Entering React/Vite storefront container terminal...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -it frontend sh

shell-admin: ## Open an interactive sh shell inside the live React/Vite admin container
	@echo -e "$(COLOR_CYAN)🖧 Entering React/Vite admin container terminal...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -it admin sh

shell-db: ## Open an interactive PostgreSQL (psql) administration prompt
	@echo -e "$(COLOR_CYAN)🖧 Entering PostgreSQL database CLI (psql)...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -it db psql -U $(DB_USER) -d $(DB_NAME)

shell-redis: ## Open an interactive Redis Cache (redis-cli) prompt
	@echo -e "$(COLOR_CYAN)🖧 Entering Redis cache CLI (redis-cli)...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -it redis redis-cli

# ==============================================================================
# 🧪 QUALITY ASSURANCE & TESTING
# ==============================================================================
test-backend: ## Execute full Django test suite inside Docker (requires active container)
	@echo -e "$(COLOR_GREEN)▶ Executing comprehensive Django test suite inside Docker backend...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend python manage.py test

check-frontend: ## Lint the React/Vite storefront (oxlint) for zero-error verification
	@echo -e "$(COLOR_GREEN)▶ Verifying storefront lint safety and build readiness...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec frontend npm run lint

check-admin: ## Lint the React/Vite admin panel (oxlint) for zero-error verification
	@echo -e "$(COLOR_GREEN)▶ Verifying admin panel lint safety and build readiness...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec admin npm run lint

# ==============================================================================
# 💾 DATABASE MIGRATION UTILITIES
# ==============================================================================
migrate: ## Apply any pending Django database structure migrations inside active container
	@echo -e "$(COLOR_GREEN)▶ Applying database structure schema migrations...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend python manage.py migrate

make-migration: ## Generate new Django migration files. Usage: make make-migration app="catalog"
	@echo -e "$(COLOR_GREEN)▶ Generating database schema migration scripts...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend python manage.py makemigrations $(app)

seed: ## Seed the catalog, inventory, orders, customers, and store settings demo data
	@echo -e "$(COLOR_GREEN)▶ Seeding demo catalog, inventory and store data...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend python manage.py seed_data

create-superadmin: ## Bootstrap an admin/staff superuser interactively (Django createsuperuser)
	@echo -e "$(COLOR_GREEN)▶ Creating a new Django superuser...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec -it backend python manage.py createsuperuser

collectstatic: ## Collect Django static assets into STATIC_ROOT (for production serving)
	@echo -e "$(COLOR_GREEN)▶ Collecting Django static assets...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) exec backend python manage.py collectstatic --noinput

# ==============================================================================
# 🧹 SYSTEM MAINTENANCE & CLEANUP
# ==============================================================================
clean: ## Remove stopped containers, dangling images, and ephemeral container artifacts
	@echo -e "$(COLOR_YELLOW)🧹 Cleaning stopped containers and unattached networks...$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down --remove-orphans

clean-docker: ## Deep clean Docker: remove ALL unused containers, networks, images, and builder cache
	@echo -e "$(COLOR_YELLOW)🧹 Deep cleaning Docker system and build cache (WARNING: Next build will take longer)...$(COLOR_RESET)"
	docker system prune -af --volumes
	docker builder prune -af

purge-data: ## DANGER: Wipe out all containers AND completely erase database storage volumes (Factory Reset)
	@echo -e "$(COLOR_BOLD)\033[31m⚠ DANGER: Wiping all container state and PostgreSQL database storage volumes!$(COLOR_RESET)"
	$(DOCKER_COMPOSE) -f $(COMPOSE_FILE) down -v --remove-orphans
	@echo -e "$(COLOR_GREEN)✔ Platform storage reset complete. Next 'make up' will initialize a fresh db.$(COLOR_RESET)"
