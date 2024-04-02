package main

import (
	"encoding/json"
	ckafka "github.com/confluentinc/confluent-kafka-go/v2/kafka"
	"github.com/devolthq/depin/simulation/internal/domain/entity"
	"github.com/devolthq/depin/simulation/internal/infra/blockchain"
	"github.com/devolthq/depin/simulation/internal/infra/kafka"
	"github.com/gagliardetto/solana-go"
	"github.com/near/borsh-go"
	"log"
	"os"
)

type Borsh struct {
	Kind          uint8   `json:"kind"`
	ID            string  `json:"id"`
	Max_Capacity  float64 `json:"max_capacity"`
	Battery_Level float64 `json:"battery_level"`
	Latitude      float64 `json:"latitude"`
	Longitude     float64 `json:"longitude"`
}

func main() {
	msgChan := make(chan *ckafka.Message)
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers":  os.Getenv("CONFLUENT_BOOTSTRAP_SERVER_SASL"),
		"sasl.mechanisms":    "PLAIN",
		"security.protocol":  "SASL_SSL",
		"sasl.username":      os.Getenv("CONFLUENT_API_KEY"),
		"sasl.password":      os.Getenv("CONFLUENT_API_SECRET"),
		"session.timeout.ms": 6000,
		"group.id":           "devolt",
		"auto.offset.reset":  "latest",
	}

	kafkaRepository := kafka.NewKafkaConsumer(configMap, []string{os.Getenv("CONFLUENT_KAFKA_TOPIC_NAME")})
	go func() {
		if err := kafkaRepository.Consume(msgChan); err != nil {
			log.Printf("Error consuming kafka queue: %v", err)
		}
	}()

	client := blockchain.NewSolanaClient("./config/solana.json")
	programId := solana.MustPublicKeyFromBase58("AQnX4CcPXJW281LLyTeccrMyaNxwfgw7xGjTMRPC8YtW")

	for msg := range msgChan {
		stationPayload := entity.StationPayload{}
		err := json.Unmarshal(msg.Value, &stationPayload)
		if err != nil {
			log.Printf("Error unmarshalling msg into JSON: %v", err)
			continue
		}

		rawPayload := Borsh{
			Kind:          0,
			ID:            stationPayload.ID,
			Latitude:      stationPayload.Latitude,
			Longitude:     stationPayload.Longitude,
			Max_Capacity:  stationPayload.MaxCapacity,
			Battery_Level: stationPayload.BatteryLevel,
		}

		serializedPayload, err := borsh.Serialize(rawPayload)
		log.Printf("Serialized payload: %v", serializedPayload)
		if err != nil {
			log.Printf("Error serializing payload: %v", err)
		}

		signature, err := client.Stream(programId, serializedPayload)
		if err != nil {
			log.Printf("Error streaming: %v", err)
		}
		log.Printf("Message on %s: %s 2", msg.TopicPartition, string(msg.Value))
		log.Printf("Transaction executed with signature: %v", signature)
	}
}
