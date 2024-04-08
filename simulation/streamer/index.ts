import { type EachMessagePayload, Kafka, Consumer} from 'kafkajs';

const kafka = new Kafka({
  clientId: 'sample-consumer',
  brokers: ['localhost:9092'],
});

const consumer: Consumer = kafka.consumer({ groupId: 'notification-group' });

const handleMessage = async ({ topic, partition, message }: EachMessagePayload): Promise<void> => {
  console.log(`Received message from topic '${topic}': ${message.value.toString()}`);

  if (topic === 'email-topic') {
    // Handle email notification
    console.log('Handling email notification:', message.value.toString());
  } else if (topic === 'sms-topic') {
    // Handle SMS notification
    console.log('Handling SMS notification:', message.value.toString());
  } else {
    console.log('Unknown topic:', topic);
  }

  await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
};

const runConsumer = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'email-topic' });
  await consumer.subscribe({ topic: 'sms-topic' });

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