package blockchain

import (
	"context"
	"fmt"
	"github.com/gagliardetto/solana-go"
	"github.com/gagliardetto/solana-go/rpc"
	handler "github.com/gagliardetto/solana-go/rpc/sendAndConfirmTransaction"
	"github.com/gagliardetto/solana-go/rpc/ws"
	"github.com/gagliardetto/solana-go/text"
	"os"
)

type SolanaClient struct {
	Authority *solana.PrivateKey
	RpcClient *rpc.Client
	WsClient  *ws.Client
}

func NewSolanaClient(path string) *SolanaClient {
	authority, err := solana.PrivateKeyFromSolanaKeygenFile(path)
	if err != nil {
		panic(err)
	}
	wsClient, err := ws.Connect(context.Background(), rpc.DevNet_WS)
	if err != nil {
		panic(err)
	}
	return &SolanaClient{
		Authority: &authority,
		RpcClient: rpc.New(rpc.DevNet_RPC),
		WsClient:  wsClient,
	}
}

func (s *SolanaClient) Stream(programId solana.PublicKey, payload []byte) (solana.Signature, error) {
	recentBlockhash, err := s.RpcClient.GetRecentBlockhash(context.TODO(), rpc.CommitmentFinalized)
	if err != nil {
		panic(err)
	}
	tx, err := solana.NewTransaction(
		[]solana.Instruction{
			solana.NewInstruction(
				programId,
				solana.AccountMetaSlice{
					{
						PublicKey:  s.Authority.PublicKey(),
						IsSigner:   true,
						IsWritable: true,
					},
				},
				payload,
			),
		},
		recentBlockhash.Value.Blockhash,
		solana.TransactionPayer(s.Authority.PublicKey()),
	)
	if err != nil {
		panic(err)
	}
	tx.EncodeTree(text.NewTreeEncoder(os.Stdout, "Streaming station Battery Report"))
	_, err = tx.Sign(
		func(key solana.PublicKey) *solana.PrivateKey {
			if s.Authority.PublicKey().Equals(key) {
				return s.Authority
			}
			return nil
		},
	)
	if err != nil {
		panic(fmt.Errorf("failed to sign transaction: %w", err))
	}
	signature, err := handler.SendAndConfirmTransaction(
		context.TODO(),
		s.RpcClient,
		s.WsClient,
		tx,
	)
	if err != nil {
		panic(err)
	}
	return signature, nil
}
