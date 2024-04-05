package main

import (
	"bytes"
	"fmt"
	"io"
	"math/big"
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
	value := big.NewInt(0)
	valueStr := value.String()
	data := fmt.Sprintf(`{"chainName": "mumbai","operatorName": "default","to": "0xdebC1C3aCe0A41c1FB348D1ced30a61BC7A17eb6","value": "%s","data": "40c10f19000000000000000000000000%s0000000000000000000000000000000000000000000000000de0b6b3a7640000"}`, valueStr, "355448B497c04CFbF7A239aBFc1261F45E7050c9")

	req, err := http.NewRequest("POST", "/system/send_tx", strings.NewReader(data))
	if err != nil {
		log.Log(err.Error())
		return -1
	}
	req.Header.Set("eventType", "result")

	resp, err := api.Call(req)
	if err != nil {
		log.Log(err.Error())
		return -1
	}

	var buf bytes.Buffer
	if err := resp.Write(&buf); err != nil {
		log.Log(err.Error())
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