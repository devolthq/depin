# DEFAULT VARIABLES
START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

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
		up pub-solana-sdk stream-solana-sdk --build
	$(END_LOG)

.PHONY: stream
stream:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		--env-file ./config/.env \
		up stream-solana-sdk --build
	$(END_LOG)

.PHONY: run-w3bstream
run-w3bstream:
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
	touch ./config/id.json
	cp ./config/.env.tmpl ./config/.env
	$(END_LOG)