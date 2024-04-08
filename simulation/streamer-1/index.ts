import { Connection, sendAndConfirmTransaction } from '@solana/web3.js'
import { type EachMessagePayload, Kafka, KafkaConfig, Consumer } from 'kafkajs';
import { AnchorProvider, Program, Wallet, web3 } from '@coral-xyz/anchor'
import bs58 from 'bs58'
import { decode } from '@coral-xyz/anchor/dist/cjs/utils/bytes/hex'
import { Devolt, IDL } from './sdk/src/types/devolt';
import { convertSecretKeyToKeypair } from './sdk/src';
import { DEVOLT_PROGRAM_ID } from './sdk/src/constants/program';
import { getStationAddressSync } from './sdk/src/utils/helpers';

const kafka = new Kafka({
    // clientId: 'sample-consumer',
    brokers: ['host.docker.internal:9092'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'devolt', sessionTimeout: 6000 });

export default class DevoltClient {
    connection: Connection
    wallet: Wallet
    provider: AnchorProvider
    program: Program<Devolt>

    constructor(connection: Connection, wallet: Wallet) {
        this.connection = connection
        this.wallet = wallet
        this.provider = new AnchorProvider(
            this.connection,
            this.wallet,
            AnchorProvider.defaultOptions()
        )
        this.program = new Program<Devolt>(IDL, DEVOLT_PROGRAM_ID, this.provider)
    }

    async batteryReport({
        id,
        latitude,
        longitude,
        maxCapacity,
        batteryLevel
    }: {
        id: string
        latitude: number
        longitude: number
        maxCapacity: number
        batteryLevel: number
    }) {
        const encodedId = id // '3'
        const StationPDA = getStationAddressSync(this.program.programId, encodedId)
        console.log("Station PDA: ", StationPDA)

        const tx = await this.program.methods
            .batteryReport({
                id,
                latitude,
                longitude,
                maxCapacity,
                batteryLevel
            })
            .accounts({ signer: this.wallet.publicKey, station: StationPDA })
            // .rpc()
            .transaction();

        let sign = await sendAndConfirmTransaction(
            this.connection,
            tx,
            [this.wallet.payer]
        );

        return sign
    }

    async getStation(id: string) {
        const encodedId = id
        const StationPDA = getStationAddressSync(this.program.programId, encodedId)

        const station = await this.program.account.station.fetch(StationPDA)

        console.log("\nStation: ", station)
    }
}

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

        const batteryReport = JSON.parse(message.value.toString());
        console.log("Battery Report: ", batteryReport)
        
        let sig = await devoltClient.batteryReport(batteryReport);
        console.log("Transaction Signature: ", sig)

        console.log('Message handled successfully.\nStation after transaction: ');
        await devoltClient.getStation(batteryReport.id);
    } else {
        // throw new Error("Topic doesn't exist.")
        console.error("Topic doesn't exist.")
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
