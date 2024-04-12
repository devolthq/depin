# DeVolt Depin

![DeVolt](assets/logo.jpg)

Welcome to the DeVolt Depin repository!

## Overview

DeVolt's Solana programs offer a robust infrastructure for managing energy-related transactions on the blockchain. These contracts are essential for supporting the platform's dynamic and user-focused features.

## Getting Started

To set up your local development environment, follow these steps.

### Prerequisites

- 

### Installation

Clone the repository and build the smart contracts:

```bash
git clone https://github.com/devolthq/solana-programs.git
cd solana-programs
anchor build
```

## Programs

Find the smart contracts within the `programs/devolt/src` directory, with detailed functionalities outlined as follows.

### Battery Report

O programa `battery_report` permite que as estações enviem atualizações do status de suas baterias. Essas informações são críticas para a gestão eficiente de energia dentro da plataforma DeVolt.

Localizado em: `programs/devolt/src/instructions/battery_report.rs`.

Funcionalidades:
- Autenticação da estação com a chave do assinante.
- Atualização dos dados da estação, como identificação e estado da bateria.
- Finalização de leilões com base na hora atual e seleção dos lances vencedores.
- Criação automática de novos leilões quando a estação atinge um certo déficit de energia.

Este programa é uma parte vital da lógica de negócios da DeVolt, garantindo que o fornecimento e a demanda de energia sejam atendidos de forma eficiente e transparente.

### Place Bid

O programa `place_bid` é projetado para permitir que licitantes façam ofertas em leilões de energia na plataforma DeVolt.

Localizado em: `programs/devolt/src/instructions/place_bid.rs`.

Funcionalidades:
- Permite aos licitantes colocar lances em leilões de energia.
- Registra o lance com informações do licitante, quantidade de energia desejada e preço ofertado.
- Armazena os lances na conta da estação para avaliação ao finalizar o leilão.

Este programa ajuda a assegurar que o processo de leilão ocorra de maneira justa e ordenada, permitindo que a estação encontre as melhores ofertas de energia disponíveis.


## Development

### Building

Build the smart contracts and update the TypeScript SDK types with:

```bash
yarn build
```

Followed by:

```bash
yarn update-types
```

### Testing

Run tests with the following command:

```bash
cd sdk
```

Then:
```bash
yarn
```

And finally:
```bash
yarn start
```

## Scripts

Useful scripts for development are located in the `package.json` files:

- `lint:fix` - Auto-fix and format code with Prettier.
- `lint` - Check the code formatting with Prettier.
- `update-types` - Update the TypeScript SDK types after building.
- `build` - Build contracts and update SDK types.
- `anchor-tests` - Run tests for the smart contracts.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for the contribution process.

## License

This project is under the ISC license for root directory code and MIT license for the SDK. See the [LICENSE.md](LICENSE) file in the respective directories for details.

## Documentation

For more information on Anchor, the framework used for DeVolt smart contracts, visit the official [Anchor documentation](https://www.anchor-lang.com/).