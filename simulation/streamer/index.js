const { Kafka, ErrorCodes } = require('@confluentinc/kafka-javascript').KafkaJS;

async function consumerStart() {
  let consumer;
  let stopped = false;

  // Set up signals for a graceful shutdown.
  const disconnect = () => {
    process.off('SIGINT', disconnect);
    process.off('SIGTERM', disconnect);
    stopped = true;
    consumer.commitOffsets()
      .finally(() =>
        consumer.disconnect()
      )
      .finally(() =>
        console.log("Disconnected successfully")
      );
  }
  process.on('SIGINT', disconnect);
  process.on('SIGTERM', disconnect);

  // Initialization
  consumer = new Kafka().consumer({
    "bootstrap.servers": "host.docker.internal:9094",
    "session.timeout.ms": 6000,
    "group.id": "devolt",
    "auto.offset.reset": "latest",
  });

  await consumer.connect();
  console.log("Connected successfully");
  await consumer.subscribe({ topics: ["stations"] });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      console.log({
        topic,
        partition,
        offset: message.offset,
        key: message.key?.toString(),
        value: message.value.toString(),
      });
    }
  });
}

consumerStart();