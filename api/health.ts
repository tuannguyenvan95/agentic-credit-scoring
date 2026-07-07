import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  return res.status(200).json({
    service: 'Agentic Credit Scoring & Sybil Resistance Oracle',
    version: '1.0.0',
    network: 'Unicity Testnet v2',
    status: 'operational',
    endpoints: {
      score: {
        method: 'GET',
        path: '/api/score?nametag={nametagId}',
        description: 'Query the credit score for a Sphere Nametag',
        example: '/api/score?nametag=Agent_Alpha_01',
        cost: '0.5 testnet tokens (waived in demo)',
      },
      health: {
        method: 'GET',
        path: '/api/health',
        description: 'Health check endpoint',
      },
    },
    scoringMatrix: {
      range: '0-100',
      ratings: ['Sybil (0-19)', 'Poor (20-39)', 'Fair (40-59)', 'Good (60-79)', 'Excellent (80-100)'],
      factors: [
        'Counterparty Diversity',
        'AstridOS Sandbox Verification',
        'Wallet Age',
        'Spam Pattern Detection',
      ],
    },
    timestamp: new Date().toISOString(),
  });
}
