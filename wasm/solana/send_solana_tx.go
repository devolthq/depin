package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"strings"

	"github.com/machinefi/w3bstream-wasm-golang-sdk/api"
	"github.com/machinefi/w3bstream-wasm-golang-sdk/common"
	"github.com/machinefi/w3bstream-wasm-golang-sdk/log"
	"github.com/machinefi/w3bstream-wasm-golang-sdk/stream"
)

func main() {}

//export start
func _start(rid uint32) int32 {
	data := `{"chainName": "solana-devnet","operatorName": "solana-key","data": "[{\"ProgramID\":[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],\"Accounts\":[{\"PubKey\":[91,83,29,193,46,31,234,109,208,211,168,16,189,248,144,184,82,206,5,207,47,237,60,0,252,70,215,201,95,8,82,113],\"IsSigner\":true,\"IsWritable\":true},{\"PubKey\":[91,83,29,193,46,31,234,109,208,211,168,16,189,248,144,184,82,206,5,207,47,237,60,0,252,70,215,201,95,8,82,113],\"IsSigner\":false,\"IsWritable\":true}],\"Data\":\"AgAAAAEAAAAAAAAA\"}]"}`

	req, err := http.NewRequest("POST", "/system/send_tx", strings.NewReader(data))
	if err != nil {
		return -1
	}
	req.Header.Set("eventType", "result")

	resp, err := api.Call(req)
	if err != nil {
		return -1
	}

	var buf bytes.Buffer
	if err := resp.Write(&buf); err != nil {
		return -1
	}

	log.Log(string(buf.Bytes()))

	return 0
}

//export handle_result
func _handle_result(rid uint32) int32 {
	log.Log(fmt.Sprintf("start rid: %d", rid))

	message, err := stream.GetDataByRID(rid)
	if err != nil {
		log.Log(err.Error())
		return -1
	}

	defer func() {
		if common.FreeResource(rid) {
			log.Log(fmt.Sprintf("resource %v released", rid))
		}
	}()

	resp, err := api.ConvResponse(message)
	if err != nil {
		log.Log(err.Error())
		return -1
	}
	body, err := io.ReadAll(resp.Body)
	if err != nil {
		log.Log(err.Error())
		return -1
	}

	log.Log(fmt.Sprintf("get result: %v, status: %v, information: %v", rid, resp.Status, string(body)))
	return 0
}