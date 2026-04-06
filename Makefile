# =============================================================================
# SchulFit - Makefile
# =============================================================================
# Commands for development and production Docker environments
# =============================================================================

.PHONY: help dev up down build prod test lint logs clean shell

.DEFAULT_GOAL := help

# Colors for output
YELLOW := \033[33m
GREEN := \033[32m
CYAN := \033[36m
RED := \033[31m
RESET := \033[0m

# -----------------------------------------------------------------------------
# Help
# -----------------------------------------------------------------------------
help: ## Show this help message
	@echo ""
	@echo "$(CYAN)SchulFit$(RESET) - German School Prep App"
	@echo "$(YELLOW)========================================$(RESET)"
	@echo ""
	@echo "$(GREEN)Development:$(RESET)"
	@echo "  make dev       Start development server with hot reload"
	@echo "  make up        Build and start development container"
	@echo "  make down      Stop and remove containers"
	@echo "  make logs      View container logs (follow mode)"
	@echo "  make shell     Open shell in dev container"
	@echo ""
	@echo "$(GREEN)Production:$(RESET)"
	@echo "  make prod      Build and run production server"
	@echo "  make build     Build production Docker image only"
	@echo ""
	@echo "$(GREEN)Testing:$(RESET)"
	@echo "  make test      Run test suite"
	@echo "  make lint      Run ESLint"
	@echo ""
	@echo "$(GREEN)Maintenance:$(RESET)"
	@echo "  make clean     Remove all containers, images, and volumes"
	@echo ""

# -----------------------------------------------------------------------------
# Pre-flight Checks
# -----------------------------------------------------------------------------
check-docker:
	@command -v docker >/dev/null 2>&1 || { echo "$(RED)Error: Docker is not installed$(RESET)"; exit 1; }
	@docker info >/dev/null 2>&1 || { echo "$(RED)Error: Docker daemon is not running$(RESET)"; exit 1; }

check-deps:
	@if [ ! -d "node_modules" ]; then \
		echo "$(YELLOW)Installing dependencies...$(RESET)"; \
		npm ci; \
	fi

# -----------------------------------------------------------------------------
# Development Commands
# -----------------------------------------------------------------------------
dev: check-docker ## Start development server with hot reload
	@echo "$(GREEN)Starting development server...$(RESET)"
	@docker compose up dev

up: check-docker ## Build and start development container
	@echo "$(GREEN)Building and starting development container...$(RESET)"
	@docker compose build dev
	@docker compose up dev

down: check-docker ## Stop and remove containers
	@echo "$(YELLOW)Stopping containers...$(RESET)"
	@docker compose down --remove-orphans
	@echo "$(GREEN)Done!$(RESET)"

logs: check-docker ## View container logs
	@docker compose logs -f

shell: check-docker ## Open shell in dev container
	@docker compose exec dev sh

# -----------------------------------------------------------------------------
# Production Commands
# -----------------------------------------------------------------------------
prod: check-docker ## Build and run production server
	@echo "$(GREEN)Building production image...$(RESET)"
	@docker compose build prod
	@echo "$(GREEN)Starting production server...$(RESET)"
	@docker compose up -d prod
	@echo ""
	@echo "$(GREEN)Production server running at http://localhost$(RESET)"

build: check-docker ## Build production Docker image only
	@echo "$(GREEN)Building production image...$(RESET)"
	@docker compose build prod
	@echo "$(GREEN)Build complete!$(RESET)"

# -----------------------------------------------------------------------------
# Testing Commands
# -----------------------------------------------------------------------------
test: check-deps ## Run test suite
	@echo "$(GREEN)Running tests...$(RESET)"
	@npm run test:run

lint: check-deps ## Run ESLint
	@echo "$(GREEN)Running ESLint...$(RESET)"
	@npm run lint

# -----------------------------------------------------------------------------
# Maintenance Commands
# -----------------------------------------------------------------------------
clean: check-docker ## Remove all containers, images, and volumes
	@echo "$(YELLOW)Cleaning up Docker resources...$(RESET)"
	@docker compose down --rmi local --volumes --remove-orphans 2>/dev/null || true
	@echo "$(GREEN)Cleanup complete!$(RESET)"
