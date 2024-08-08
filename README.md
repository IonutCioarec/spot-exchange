# React + TypeScript + Vite + MultiversX

This template provides a setup to get React working in Vite with HMR and some ESLint rules and mutliversx packages.

## Requirements

- Node.js version 16.20.0+
- Npm version 8.19.4+

## Getting Started

The dapp is a client side only project and is built using the [Create React App](https://create-react-app.dev) scripts.

### Instalation and running

### Step 1. Install modules

From a terminal, navigate to the project folder and run:

```bash
yarn install
```

### Step 2. Running in development mode

In the project folder run:

```bash
yarn start:devnet
yarn start:testnet
yarn start:mainnet
```

This will start the React app in development mode, using the configs found in the `vite.config.ts` file.
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### Step 3. Build for testing and production use

A build of the app is necessary to deploy for testing purposes or for production use.
To build the project run:

```bash
yarn build:devnet
yarn build:testnet
yarn build:mainnet
```