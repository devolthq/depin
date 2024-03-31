# DEFAULT VARIABLES
START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

.PHONY: tests
tests:
	@echo "Running the tests"
	@docker compose \
		-f ./build/compose.yaml \
		up simulation --build -d
	@go test ./... -coverprofile=./tools/coverage_sheet.md -v
	@docker compose \
		-f ./build/compose.yaml \
		down simulation

.PHONY: run
run:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		up solana-sdk --build
	$(END_LOG)

.PHONY: run-w3bstream
run-w3bstream:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		up w3bstream --build
	$(END_LOG)

.PHONY: mockup
mockup:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		up mockup --build
	$(END_LOG)

.PHONY: coverage
coverage: test
	$(START_LOG)
	@go tool cover -html=./tools/coverage_sheet.md
	$(END_LOG)

.PHONY: env
env: ./config/.env.develop.tmpl
	$(START_LOG)
	cp ./config/.env.develop.tmpl ./config/.env
	$(END_LOG)