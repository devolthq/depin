import { type EachMessagePayload, Kafka, Consumer } from "kafkajs";
import { devoltClient } from "./client";
import dotenv from "dotenv";

dotenv.config()

const kafka = new Kafka({
  clientId: "devolt-consumer",
  brokers: [process.env.CONFLUENT_BOOTSTRAP_SERVER],
});

const consumer: Consumer = kafka.consumer({
  groupId: "devolt",
  sessionTimeout: 60000,
  heartbeatInterval: 20000,
});

const handleMessage = async ({
  topic,
  partition,
  heartbeat,
  message,
}: EachMessagePayload): Promise<void> => {
  if (topic === process.env.CONFLUENT_KAFKA_TOPIC_NAME) {
    const batteryReport = JSON.parse(message.value!.toString());
    let sig = await devoltClient.batteryReport(batteryReport);
    console.log(`Battery report of station ${batteryReport.id} received with batteryLevel ${batteryReport.batteryLevel}, latitude ${batteryReport.latitude}, longitude ${batteryReport.longitude}, maxCapacity ${batteryReport.maxCapacity}`);
    console.log("Transaction executed with signature: ", sig);
  } else {
    console.error("Topic doesn't exist.");
  }

  await consumer.commitOffsets([{ topic, partition, offset: message.offset }]);
  await heartbeat();
};

const runConsumer = async (): Promise<void> => {
  await consumer.connect();
  await consumer.subscribe({ topic: "stations" });
  await consumer.run({
    eachMessage: handleMessage,
  });
};

runConsumer().catch((error) => {
  console.error("Failed to run kafka consumer", error);
});
