import { type EachMessagePayload, Kafka, KafkaConfig, Consumer } from 'kafkajs';
import { devoltClient } from './client';

const kafka = new Kafka({
  // clientId: 'sample-consumer',
  brokers: ['host.docker.internal:9094'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'devolt', sessionTimeout: 6000});

const handleMessage = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
    console.log(`Received message from topic '${topic}': ${message.value?.toString()}`);
    if (topic === 'stations') {
        console.log('Handling message notification:', message.value?.toString());

        const batteryReport = JSON.parse(message.value!.toString());
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

  console.log('Consumer subscribed to topics: stations');

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