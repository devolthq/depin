# DEFAULT VARIABLES
START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

.PHONY: env
env:
	$(START_LOG)
	cp ./.env.tmpl ./.env
	$(END_LOG)

.PHONY: up
up:
	$(START_LOG)
	@docker compose -f ./compose.yaml --env-file ./.env up streamer --build
	$(END_LOG)

.PHONY: down
down:
	$(START_LOG)
	@docker compose down
	$(END_LOG)