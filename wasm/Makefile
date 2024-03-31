START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

.PHONY: build-wasm-solana
build-wasm-solana:
	$(START_LOG)
	@echo "Building WASM Solana for W3bstream Applet"
	@go mod tidy
	@tinygo build -o ./solana/bin/main.wasm -scheduler=none --no-debug -target=wasi ./solana/main.go
	@echo "Building WASM Solana for W3bstream Applet - DONE"
	$(END_LOG)

.PHONY: build-wasm-ethereum
build-wasm-ethereum:
	$(START_LOG)
	@echo "Building WASM Ethereum for W3bstream Applet"
	@go mod tidy
	@tinygo build -o ./ethereum/bin/main.wasm -scheduler=none --no-debug -target=wasi ./ethereum/main.go
	@echo "Building WASM Ethereum for W3bstream Applet - DONE"
	$(END_LOG)