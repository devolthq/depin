# DeVolt Simulation

![walldev](https://github.com/devolthq/depin/assets/89201795/af04914d-02fd-45c2-96ee-154718cbe419)

Welcome to the DeVolt Simulation!

## Overview

The simulation implemented here is responsible for simulating how a Decetralized Physical Infraestructure application would behave in production with sensors publishing data, and all this data mass reaching the Solana program to be processed. This approach aims to avoid imposing hardware restrictions during evaluation by the judges. This is just a backend; here, the processes allocated to act as sensors interact with an MQTT interface, which in turn is served by a broker that has native integration with a messaging system serving as a bus, allowing the data streamer for Solana to have time to send them without losing any data along the way. Yes, this was designed for hyperscaling an extensive sensor network.

### Prerequisites

- Private Key from a Solana account funded.

### Getting Started

First of all, it's necessary setup the enviroment variables, follow the steps bellow:


#### Command:

```bash
cd stations
make env
```

Now on streamer directory perform the steps bellow:

```bash
cd streamer
make env
```

> [!WARNING]
> The previous commands are imperative to run the rest of the application. Do not proceed with this tutorial without completing them.

### Running Infrastructure

The infrastructure here is composed by a HiveMQ Broker, Confluent Kafka Messaging system and MongoDB ( Non relational database ). This infraestructure its necessary for the stations simulation part. To run, follow the commands bellow:

#### Command:

```bash
cd stations
make infra
```

#### Output:
```bash
❯ make infra
======================================================= START OF LOG =========================================================
[+] Running 28/4
 ✔ zookeeper 12 layers [⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿]      0B/0B      Pulled                                                 64.0s 
 ✔ control-center 2 layers [⣿⣿]      0B/0B      Pulled                                                       69.7s 
 ✔ kafka 2 layers [⣿⣿]      0B/0B      Pulled                                                                64.0s 
 ✔ mongo 8 layers [⣿⣿⣿⣿⣿⣿⣿⣿]      0B/0B      Pulled                                                          48.6s 
[+] Building 1.9s (9/9) FINISHED                                                              docker:desktop-linux
 => [hivemq internal] load .dockerignore                                                                      0.0s
 => => transferring context: 643B                                                                             0.0s
 => [hivemq internal] load build definition from Dockerfile.hivemq                                            0.0s
 => => transferring dockerfile: 342B                                                                          0.0s
 => [hivemq internal] load metadata for docker.io/hivemq/hivemq4:latest                                       1.8s
 => [hivemq auth] hivemq/hivemq4:pull token for registry-1.docker.io                                          0.0s
 => [hivemq internal] load build context                                                                      0.0s
 => => transferring context: 123B                                                                             0.0s
 => [hivemq 1/3] FROM docker.io/hivemq/hivemq4:latest@sha256:96ad044ba075bc7e3d4d5bde780bdd5bf59746c658b64a7  0.0s
 => CACHED [hivemq 2/3] COPY --chown=hivemq:hivemq ./config/kafka-extension/config.xml /opt/hivemq/extension  0.0s
 => CACHED [hivemq 3/3] RUN rm -f /opt/hivemq/extensions/hivemq-kafka-extension/DISABLED                      0.0s
 => [hivemq] exporting to image                                                                               0.0s
 => => exporting layers                                                                                       0.0s
 => => writing image sha256:4bc85b2456d4506a18e69d856599e731b131a6c005f301b038967af0f400a220                  0.0s
 => => naming to docker.io/library/deployments-hivemq                                                         0.0s
[+] Running 6/6
 ✔ Network deployments_default             Created                                                            0.0s 
 ✔ Container mongo                         Started                                                            0.4s 
 ✔ Container zookeeper                     Started                                                            0.4s 
 ✔ Container kafka                         Started                                                            0.1s 
 ✔ Container deployments-hivemq-1          Started                                                            0.1s 
 ✔ Container deployments-control-center-1  Started                                                            0.1s 
======================================================== END OF LOG ==========================================================
```

> [!NOTE]
> Ideally, this infrastructure should have a ZKP (Zero-Knowledge Proof) system involved that would prove the computation performed and the traffic passing through it.

### Running Simulation

The simulation is responsible for spinning up a process for each station, through the creation of Goroutines that interact with the rest of the system using an MQTT interface present in the infrastructure.

#### Command:

```bash
cd stations
make simulation
```

#### Output:

```bash
❯ make simulation
======================================================= START OF LOG =========================================================
[+] Building 16.3s (19/19) FINISHED                                                           docker:desktop-linux
 => [pub-solana internal] load .dockerignore                                                                  0.0s
 => => transferring context: 643B                                                                             0.0s
 => [pub-solana internal] load build definition from Dockerfile.pub-solana                                    0.0s
 => => transferring dockerfile: 3.09kB                                                                        0.0s
 => [pub-solana] resolve image config for docker.io/docker/dockerfile:1                                       2.4s
 => [pub-solana auth] docker/dockerfile:pull token for registry-1.docker.io                                   0.0s
 => CACHED [pub-solana] docker-image://docker.io/docker/dockerfile:1@sha256:dbbd5e059e8a07ff7ea6233b213b36aa  0.0s
 => [pub-solana internal] load metadata for docker.io/library/golang:1.22.1                                   2.8s
 => [pub-solana internal] load metadata for docker.io/library/alpine:latest                                   3.9s
 => [pub-solana auth] library/golang:pull token for registry-1.docker.io                                      0.0s
 => [pub-solana auth] library/alpine:pull token for registry-1.docker.io                                      0.0s
 => [pub-solana build 1/4] FROM docker.io/library/golang:1.22.1@sha256:0b55ab82ac2a54a6f8f85ec8b943b9e470c39  0.0s
 => [pub-solana final 1/4] FROM docker.io/library/alpine:latest@sha256:c5b1261d6d3e43071626931fc004f70149bae  0.0s
 => [pub-solana internal] load build context                                                                  0.0s
 => => transferring context: 30.87kB                                                                          0.0s
 => CACHED [pub-solana build 2/4] WORKDIR /src                                                                0.0s
 => CACHED [pub-solana build 3/4] RUN --mount=type=cache,target=/go/pkg/mod/     --mount=type=bind,source=go  0.0s
 => [pub-solana build 4/4] RUN --mount=type=cache,target=/go/pkg/mod/     --mount=type=bind,target=.     CGO  9.7s
 => CACHED [pub-solana final 2/4] RUN --mount=type=cache,target=/var/cache/apk     apk --update add           0.0s
 => CACHED [pub-solana final 3/4] RUN adduser     --disabled-password     --gecos ""     --home "/nonexisten  0.0s
 => CACHED [pub-solana final 4/4] COPY --from=build /bin/server /bin/                                         0.0s
 => [pub-solana] exporting to image                                                                           0.0s
 => => exporting layers                                                                                       0.0s
 => => writing image sha256:8c9d83bb555dbd6763743518441d5e2263c20042be839c956dc7f1d0b164976f                  0.0s
 => => naming to docker.io/library/build-pub-solana                                                           0.0s
[+] Running 2/2
 ✔ Network build_default  Created                                                                             0.0s 
 ✔ Container pub-solana   Started                                                                             0.0s 
======================================================== END OF LOG ==========================================================
```

> [!NOTE]
> Currently, the sensors are created using mocked data present in MongoDB. In a production application, the stations themselves would be identified in the system through their communication.

### Running Streamer
The streamer is responsible for consuming the data blocked in the messaging and sending it to the program for analysis.

#### Command:
```bash
cd streamer
make streamer
```