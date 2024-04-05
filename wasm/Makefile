START_LOG = @echo "======================================================= START OF LOG ========================================================="
END_LOG = @echo "======================================================== END OF LOG =========================================================="

.PHONY: build
build:
	$(START_LOG)
	@echo "Building WASM Ethereum for W3bstream Applet"
	@go mod tidy
	@tinygo build -o ./bin/main.wasm -scheduler=none --no-debug -target=wasi ./main.go
	@echo "Building WASM Ethereum for W3bstream Applet - DONE"
	$(END_LOG)
