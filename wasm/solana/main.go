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
	data := `{"chainName": "solana-devnet","operatorName": "solana-key","data": "[{\"ProgramID\":[104, 59, 220, 142, 159, 114, 56, 72, 140, 200, 146, 110, 144, 143, 204, 231, 91, 229, 254, 168, 234, 135,6, 21,155, 27, 101, 118, 176, 230, 176, 189],\"Accounts\":[{\"PubKey\":[163, 5, 193, 216, 243, 33, 223, 130, 145, 9, 117, 106, 254, 86, 171, 115, 255, 3, 202, 13, 71, 103, 142, 162, 238, 169, 164, 211, 45, 242, 230, 132],\"IsSigner\":true,\"IsWritable\":true},{\"PubKey\":[163, 5, 193, 216, 243, 33, 223, 130, 145, 9, 117, 106, 254, 86, 171, 115, 255, 3, 202, 13, 71, 103, 142, 162, 238, 169, 164, 211, 45, 242, 230, 132],\"IsSigner\":true,\"IsWritable\":true}],\"Data\":\"AgAAAAEAAAAAAAAA\"}]"}`

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
