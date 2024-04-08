import { type EachMessagePayload, Kafka, Consumer} from 'kafkajs';

const kafka = new Kafka({
  // clientId: 'sample-consumer',
  brokers: ['host.docker.internal:9094'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'devolt', sessionTimeout: 6000});

const handleMessage = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
  if (message.value) {
    console.log(`Received message from topic '${topic}': ${message.value.toString()}`);

    if (topic === 'stations') {
      console.log('Handling batteryReport log:', message.value.toString());
    } else {
      console.log('Unknown topic:', topic);
    }

    await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
  } else {
    console.log('Received message with null value');
  }
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