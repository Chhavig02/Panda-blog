.PHONY: help install build start stop restart logs clean

help:
	@echo "Available commands:"
	@echo "  make install    - Install all dependencies"
	@echo "  make build      - Build all services"
	@echo "  make start      - Start all services with Docker"
	@echo "  make stop       - Stop all services"
	@echo "  make restart    - Restart all services"
	@echo "  make logs       - Show logs from all services"
	@echo "  make clean      - Clean up Docker containers and volumes"

install:
	cd services/user-service && npm install
	cd services/post-service && npm install
	cd services/comment-service && npm install
	cd services/gateway && npm install
	cd frontend && npm install

build:
	docker-compose build

start:
	docker-compose up -d

stop:
	docker-compose down

restart: stop start

logs:
	docker-compose logs -f

clean:
	docker-compose down -v
	docker system prune -f

