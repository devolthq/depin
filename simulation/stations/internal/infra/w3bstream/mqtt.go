package w3bstream

import (
	"encoding/json"
	"google.golang.org/protobuf/proto"
	"github.com/machinefi/w3bstream/pkg/depends/protocol/eventpb"
	MQTT "github.com/machinefi/w3bstream/pkg/depends/conf/mqtt"
	"log"
)

type W3bMqttClient struct {
	Client *MQTT.Client
}

func NewW3bMqttClient(id string, broker *MQTT.Broker) (*W3bMqttClient, error) {
	client, err := broker.Client(id)
	if err != nil {
		return nil, err
	}
	return &W3bMqttClient{
		Client: client,
	}, nil
}

func (c *W3bMqttClient) Publish(topic string, payload []byte) error {
	event := &eventpb.Event{}
	err := proto.Unmarshal(payload, event)
	if err != nil {
			return err
	}
	jsonPayload, err := json.Marshal(event)
	if err != nil {
			return err
	}
	log.Printf("Publishing message %s to topic %s", string(jsonPayload), topic)
	return c.Client.WithTopic(topic).Publish(payload)
}
