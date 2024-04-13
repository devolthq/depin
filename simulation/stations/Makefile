# DEFAULT VARIABLES
START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

.PHONY: infra
infra:
	$(START_LOG)
	@docker compose -f ./deployments/compose.yaml up --build -d
	$(END_LOG)

.PHONY: simulation
simulation:
	$(START_LOG)
	@docker compose \
		-f ./build/compose.yaml \
		--env-file ./config/.env \
		up pub-solana --build -d
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