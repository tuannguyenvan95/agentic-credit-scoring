import { SphereSDK } from './sdk/sphere';
import { OnChainScanner } from './core/scanner';
import { ScoringEngine } from './core/scoring';
import { ScoreServer } from './api/server';

async function bootstrap() {
  console.log('===================================================');
  console.log(' Agentic Credit Scoring & Sybil Resistance System  ');
  console.log(' Starting up autonomous agent loop...              ');
  console.log('===================================================');

  // 1. Initialize Primitives
  const sdk = new SphereSDK();
  const scanner = new OnChainScanner(sdk);
  const scoring = new ScoringEngine();
  const server = new ScoreServer(sdk, scanner, scoring);

  // 2. Simulate the autonomous pipeline
  console.log('\n--- SIMULATION START ---');

  const clientAgent = 'Commercial_DeFi_Agent_01';
  const targetUserA = 'Nametag_GenuineUser';
  const targetUserB = 'Nametag_SybilBot';

  console.log(`\n> Scenario 1: ${clientAgent} queries score for ${targetUserA}`);
  const pr1 = await server.handleScoreQueryRequest(clientAgent, targetUserA);
  
  console.log(`\n> Simulating payment completion for ${pr1.id}...`);
  await server.handlePaymentCompleted(pr1.id);

  console.log('\n---------------------------------------------------');

  console.log(`\n> Scenario 2: ${clientAgent} queries score for ${targetUserB}`);
  const pr2 = await server.handleScoreQueryRequest(clientAgent, targetUserB);
  
  console.log(`\n> Simulating payment completion for ${pr2.id}...`);
  await server.handlePaymentCompleted(pr2.id);

  console.log('\n--- SIMULATION END ---');
  console.log('Agent loop shutting down.');
}

bootstrap().catch(console.error);
