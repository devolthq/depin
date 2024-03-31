package main

import (
	"context"
	"google.golang.org/protobuf/proto"
	"fmt"
	"github.com/google/uuid"
	"github.com/devolthq/depin/simulation/internal/infra/repository"
	"github.com/devolthq/depin/simulation/internal/infra/w3bstream"
	"github.com/devolthq/depin/simulation/internal/usecase"
	"github.com/machinefi/w3bstream/pkg/depends/base/types"
	MQTT "github.com/machinefi/w3bstream/pkg/depends/conf/mqtt"
	"github.com/machinefi/w3bstream/pkg/depends/protocol/eventpb"
	"github.com/machinefi/w3bstream/pkg/depends/x/misc/retry"
	"github.com/devolthq/depin/simulation/internal/domain/entity"
	"github.com/pkg/errors"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"os"
	"strconv"
	"sync"
	"time"
)

func main() {
	options := options.Client().ApplyURI(
		fmt.Sprintf("mongodb+srv://%s:%s@%s/?retryWrites=true&w=majority&appName=%s",
			os.Getenv("MONGODB_ATLAS_USERNAME"),
			os.Getenv("MONGODB_ATLAS_PASSWORD"),
			os.Getenv("MONGODB_ATLAS_CLUSTER_HOSTNAME"),
			os.Getenv("MONGODB_ATLAS_APP_NAME")))
	client, err := mongo.Connect(context.TODO(), options)
	if err != nil {
		log.Fatalf("Failed to connect to MongoDB: %v", err)
	}

	err = client.Ping(context.TODO(), nil)
	if err != nil {
		log.Fatal(err)
	}

	repository := repository.NewStationRepositoryMongo(client, "mongodb", "stations")
	findAllStationsUseCase := usecase.NewFindAllStationsUseCase(repository)

	stations, err := findAllStationsUseCase.Execute()
	if err != nil {
		log.Fatalf("Failed to find all stations: %v", err)
	}

	port, err := strconv.Atoi(os.Getenv("W3BSTREAM_MQTT_PORT"))
	if err != nil {
		log.Fatalf("Failed to parse port: %v", err)
	}

	opts := &MQTT.Broker{
		Server: types.Endpoint{
			Scheme:   "mqtt",
			Hostname: os.Getenv("W3BSTREAM_MQTT_HOST"),
			Port:     uint16(port),
			// if have username and password
			//Username: "",
			//Password: types.Password(""),
		},
		Retry:     *retry.Default,
		Timeout:   types.Duration(time.Second * time.Duration(10)),
		Keepalive: types.Duration(time.Second * time.Duration(10)),
		QoS:       MQTT.QOS__ONCE,
	}
	opts.SetDefault()
	if err := opts.Init(); err != nil {
		panic(errors.Wrap(err, "init broker"))
	}

	var wg sync.WaitGroup
	for _, station := range stations {
		wg.Add(1)
		log.Printf("Starting station: %v", station)
		go func(station usecase.FindAllStationsOutputDTO) {
			defer wg.Done()
			for {
				client, err := w3bstream.NewW3bMqttClient(station.ID, opts)
				if err != nil {
					log.Fatalf("Failed to create client: %v", err)
				}

				stationPayload, err := entity.NewStationPayload(
					station.ID,
					station.Params,
					time.Now(),
					station.Latitude,
					station.Longitude,
				)
				if err != nil {
					log.Fatalf("Failed to create station payload: %v", err)
				}

				payload := &eventpb.Event{
					Header: &eventpb.Header{
						Token:   os.Getenv("W3BSTREAM_MQTT_TOKEN"),
						PubTime: time.Now().UTC().UnixMicro(),
						EventId: uuid.NewString(),
						PubId:   uuid.NewString(),
					},
					// Payload: []byte("10"),
					Payload: []byte(fmt.Sprintf("%v", stationPayload)),
				}
				jsonBytesPayload, err := proto.Marshal(payload)
				if err != nil {
					log.Println("Error converting to JSON:", err)
				}

				err = client.Publish(os.Getenv("W3BSTREAM_MQTT_TOPIC"), jsonBytesPayload)
				if err != nil {
					log.Println("Error publishing message:", err)
				}
				time.Sleep(120 * time.Second)
			}
		}(station)
	}
	wg.Wait()
}
