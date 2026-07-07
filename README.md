# Agentic Credit Scoring & Sybil Resistance System

A zero-human-in-the-loop reputation oracle and identity scoring agent for the **Unicity Testnet v2**, targeting the **Open Track** of the Builder Program.

## Core Concept

In a machine-dominated internet, this agent programmatically:
1. **Indexes** on-chain transaction history of Sphere Nametags
2. **Detects** Sybil bots via behavioral pattern analysis
3. **Computes** a dynamic Credit Score (0-100)
4. **Sells** reputation data to commercial agents via a P2P payment paywall

## Architecture

```
src/
├── sdk/
│   └── sphere.ts        # Sphere SDK interface (identity, payments, messaging)
├── core/
│   ├── scanner.ts       # On-Chain Indexer & Behavioral Scanner
│   └── scoring.ts       # Sybil Detection & Credit Scoring Engine
├── api/
│   └── server.ts        # Data Paywall & Payment Request Handler
└── index.ts             # Autonomous Agent Entry Point
```

## Scoring Matrix

| Factor | High Score | Low Score |
|---|---|---|
| Counterparty Diversity | > 20 unique partners (+20) | < 3 partners (-30) |
| AstridOS Verification | Verified sandbox (+15) | Unverified (0) |
| Wallet Age | > 180 days (+10) | < 7 days (-20) |
| Spam Detection | Normal activity (0) | High freq, low value (-40) |

## Getting Started

```bash
npm install
npm run build
npm start
```

## Built With

- TypeScript
- Sphere SDK (mock interface for testnet)
- Unicity Testnet v2

## License

MIT
