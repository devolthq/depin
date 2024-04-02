# DEFAULT VARIABLES
START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

.PHONY: run
run:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		--env-file ./config/.env \
		up pub-solana-sdk stream-solana-sdk --build
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
env: ./config/.env.develop.tmpl
	$(START_LOG)
	touch ./config/solana.json
	cp ./config/.env.develop.tmpl ./config/.env
	$(END_LOG)