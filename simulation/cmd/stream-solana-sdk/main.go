// package main

// import (
//   "context"
//   "fmt"
//   "os"
//   "github.com/davecgh/go-spew/spew"
//   "github.com/gagliardetto/solana-go"
//   "github.com/gagliardetto/solana-go/rpc"
//   confirm "github.com/gagliardetto/solana-go/rpc/sendAndConfirmTransaction"
//   _ "github.com/gagliardetto/solana-go/rpc/jsonrpc"
//   "github.com/gagliardetto/solana-go/rpc/ws"
//   "github.com/gagliardetto/solana-go/text"
// )

// func main() {
//   /////////////// create client ///////////////////////

//   rpcClient := rpc.New(rpc.DevNet_RPC)
//   wsClient, err := ws.Connect(context.Background(), rpc.DevNet_WS)
//   if err != nil {
//     panic(err)
//   }

//   accountFrom, err := solana.PrivateKeyFromSolanaKeygenFile("../../config/id.json")
//   if err != nil {
//     panic(err)
//   }
//   fmt.Println("accountFrom private key:", accountFrom)
//   fmt.Println("accountFrom public key:", accountFrom.PublicKey())
//   pkpid := solana.MustPublicKeyFromBase58("8asQgrQqM8svmhsSFj6QQX4jtLaL8CuCaHYX2nCrENbt")

//   ///////////////////// transaction confguration ///////////////////////
//   recent, err := rpcClient.GetRecentBlockhash(context.TODO(), rpc.CommitmentFinalized)
//   if err != nil {
//     panic(err)
//   }

//   tx, err := solana.NewTransaction(
//     []solana.Instruction{
//       solana.NewInstruction(
//         pkpid,
//         solana.AccountMetaSlice{
//             {
//                 PublicKey:  accountFrom.PublicKey(),
//                 IsSigner:   true,
//                 IsWritable: true,
//             },
//         },
//         []byte{0x00, 0x01, 0x00, 0x00, 0x00, 0x31, 0x00, 0x00, 0x80, 0x3f, 0xd7, 0xa3, 0x00, 0x40, 0x00, 0x00, 0xc8, 0x42, 0x00, 0x00, 0x98, 0x41}, // Instruction data
//       ),
//     },
//     recent.Value.Blockhash,
//     solana.TransactionPayer(accountFrom.PublicKey()),
//   )
//   if err != nil {
//     panic(err)
//   }

//   fmt.Printf("tx: %v\n", tx)

//   _, err = tx.Sign(
//     func(key solana.PublicKey) *solana.PrivateKey {
//       if accountFrom.PublicKey().Equals(key) {
//         return &accountFrom
//       }
//       return nil
//     },
//   )
//   if err != nil {
//     panic(fmt.Errorf("unable to sign transaction: %w", err))
//   }
//   spew.Dump(tx)
//   // Pretty print the transaction:
//   tx.EncodeTree(text.NewTreeEncoder(os.Stdout, "Transfer SOL"))

//   sig, err := confirm.SendAndConfirmTransaction(
//     context.TODO(),
//     rpcClient,
//     wsClient,
//     tx,
//   )
//   if err != nil {
//     panic(err)
//   }
//   spew.Dump(sig)
// }

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

type SolanaBorshEncode struct {
	Kind         uint8   `json:"kind"`
	ID           string  `json:"id"`
	MaxCapacity  float64 `json:"max_capacity"`
	BatteryLevel float64 `json:"battery_level"`
	Latitude     float64 `json:"latitude"`
	Longitude    float64 `json:"longitude"`
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

	client := blockchain.NewSolanaClient("./config/id.json")
	programId := solana.MustPublicKeyFromBase58("8asQgrQqM8svmhsSFj6QQX4jtLaL8CuCaHYX2nCrENbt")
	payload := []byte{0x00, 0x01, 0x00, 0x00, 0x00, 0x31, 0x00, 0x00, 0x80, 0x3f, 0xd7, 0xa3, 0x00, 0x40, 0x00, 0x00, 0xc8, 0x42, 0x00, 0x00, 0x98, 0x41}

	for msg := range msgChan {
		stationPayload := entity.StationPayload{}
		err := json.Unmarshal(msg.Value, &stationPayload)
		if err != nil {
			log.Printf("Error unmarshalling msg into JSON: %v", err)
			continue
		}

		///////////////////////////////////////////////// Borsh Serialize ///////////////////////////////////////////////////////////
		rawPayload := SolanaBorshEncode{
			Kind:         0,
			ID:           stationPayload.ID,
			MaxCapacity:  stationPayload.MaxCapacity,
			BatteryLevel: stationPayload.BatteryLevel,
			Latitude:     stationPayload.Latitude,
			Longitude:    stationPayload.Longitude,
		}

		serializedPayload, err := borsh.Serialize(rawPayload)
		log.Printf("Serialized payload: %v", serializedPayload)
		if err != nil {
			log.Printf("Error serializing payload: %v", err)
		}
		////////////////////////////////////////////////////////////////////////////////////////////////////////////

		signature, err := client.Stream(programId, payload)
		if err != nil {
			log.Printf("Error streaming: %v", err)
		}
		log.Printf("Message on %s: %s 2", msg.TopicPartition, string(msg.Value))
		log.Printf("Transaction executed with signature: %v", signature)
	}
}
