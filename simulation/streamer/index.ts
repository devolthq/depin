import { Connection } from '@solana/web3.js';
import { type EachMessagePayload, Kafka, KafkaConfig, Consumer} from 'kafkajs';
import { Wallet } from '@coral-xyz/anchor';
import bs58 from 'bs58'

const kafka = new Kafka({
  // clientId: 'sample-consumer',
  brokers: ['localhost:9092'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'devolt' });

const secretArray: number[] = [
    59, 82, 131, 25, 97, 163, 16, 56, 89, 160, 64, 28, 241, 28, 188, 186, 21, 131,
    230, 113, 252, 100, 208, 60, 137, 240, 43, 85, 254, 217, 68, 149, 163, 5, 193,
    216, 243, 33, 223, 130, 145, 9, 117, 106, 254, 86, 171, 115, 255, 3, 202, 13,
    71, 103, 142, 162, 238, 169, 164, 211, 45, 242, 230, 132]
const secret: Uint8Array = new Uint8Array(secretArray)
const secretHex: string = Array.from(secret)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
const secretBase58: string = bs58.encode(Buffer.from(secretHex, 'hex'))
const wallet = new Wallet(convertSecretKeyToKeypair(secretBase58))

const connection = new Connection('https://api.devnet.solana.com');

const devoltClient = new DevoltClient(connection, wallet);

const handleMessage = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
  console.log(`Received message from topic '${topic}': ${message.value.toString()}`);
  if (topic === 'stations') {
    console.log('Handling message notification:', message.value.toString());
    
  } else {
    throw new Error("Topic doesn't exist.")
  }

  await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
};

const runConsumer = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'stations' });

  console.log('Consumer subscribed to topics: email-topic, sms-topic');

  await consumer.run({
    eachMessage: handleMessage,
  });
};

runConsumer()
  .then(() => {
    console.log('Consumer is running...');
  })
  .catch((error) => {
    console.error('Failed to run kafka consumer', error);
  });