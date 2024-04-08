# DEFAULT VARIABLES
START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="


.PHONY: up
up:
	$(START_LOG)
	@docker compose -f ./deployments/compose.yaml up --build -d
	@docker compose \
		-f ./build/compose.yaml \
		--env-file ./config/.env \
		up pub-solana --build -d
	$(END_LOG)

.PHONY: down
down:
	$(START_LOG)
	@docker compose -f ./deployments/compose.yaml down
	@docker compose \
		-f ./build/compose.yaml \
		--env-file ./config/.env \
		down pub-solana --build
	@docker system prune -a -f
	$(END_LOG)

.PHONY: infra
infra:
	$(START_LOG)
	@docker compose -f ./deployments/compose.yaml up --build
	$(END_LOG)

.PHONY: run
run:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		--env-file ./config/.env \
		up pub-solana --build
	$(END_LOG)

.PHONY: w3bstream
w3bstream:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		up pub-w3bstream --build
	$(END_LOG)

.PHONY: mockup
mockup:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		up mockup --build
	$(END_LOG)

.PHONY: env
env:
	$(START_LOG)
	touch ./config/solana/id.json
	cp ./config/.env.tmpl ./config/.env
	$(END_LOG)