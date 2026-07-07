import type { VercelRequest, VercelResponse } from '@vercel/node';

// ── Inline scoring logic (self-contained for serverless) ──

interface TransactionGraph {
  nametagId: string;
  transactionCount: number;
  uniqueCounterparties: number;
  totalVolume: number;
  walletAgeDays: number;
  isAstridOSVerified: boolean;
}

interface CreditScoreResult {
  nametagId: string;
  score: number;
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Sybil';
  reasons: string[];
  timestamp: string;
}

function simpleHash(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
}

function scanNametag(nametagId: string): TransactionGraph {
  const hash = simpleHash(nametagId);
  const isSybilLikely = hash % 2 === 0;

  return {
    nametagId,
    transactionCount: isSybilLikely ? 5000 : Math.max(10, hash % 100),
    uniqueCounterparties: isSybilLikely ? 2 : Math.max(5, hash % 50),
    totalVolume: isSybilLikely ? 0.01 : (hash % 1000) + 10,
    walletAgeDays: isSybilLikely ? 1 : Math.max(30, hash % 365),
    isAstridOSVerified: !isSybilLikely,
  };
}

function calculateScore(graph: TransactionGraph): CreditScoreResult {
  let score = 50;
  const reasons: string[] = [];

  // Counterparty Diversity
  if (graph.uniqueCounterparties < 3) {
    score -= 30;
    reasons.push('Very low counterparty diversity (Sybil indicator)');
  } else if (graph.uniqueCounterparties > 20) {
    score += 20;
    reasons.push('High counterparty diversity');
  } else if (graph.uniqueCounterparties >= 10) {
    score += 10;
    reasons.push('Moderate counterparty diversity');
  }

  // AstridOS Sandbox Verification
  if (graph.isAstridOSVerified) {
    score += 15;
    reasons.push('Verified AstridOS Sandbox Execution');
  } else {
    score -= 5;
    reasons.push('Unverified execution environment');
  }

  // Wallet Age
  if (graph.walletAgeDays < 7) {
    score -= 20;
    reasons.push('Extremely new wallet (< 7 days)');
  } else if (graph.walletAgeDays > 180) {
    score += 10;
    reasons.push('Established wallet history (> 180 days)');
  } else if (graph.walletAgeDays > 30) {
    score += 5;
    reasons.push('Moderate wallet age');
  }

  // Spam Detection
  if (graph.transactionCount > 1000 && graph.totalVolume < 1) {
    score -= 40;
    reasons.push('High frequency, low value transactions (Spam indicator)');
  } else if (graph.transactionCount > 50 && graph.totalVolume > 100) {
    score += 5;
    reasons.push('Healthy transaction pattern');
  }

  score = Math.max(0, Math.min(100, score));

  let rating: CreditScoreResult['rating'] = 'Fair';
  if (score >= 80) rating = 'Excellent';
  else if (score >= 60) rating = 'Good';
  else if (score >= 40) rating = 'Fair';
  else if (score >= 20) rating = 'Poor';
  else rating = 'Sybil';

  return {
    nametagId: graph.nametagId,
    score,
    rating,
    reasons,
    timestamp: new Date().toISOString(),
  };
}

// ── Vercel Serverless Handler ──

export default function handler(req: VercelRequest, res: VercelResponse) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET /api/score?nametag=xxx
  const nametag = (req.query.nametag as string) || (req.body?.nametag as string);

  if (!nametag) {
    return res.status(400).json({
      error: 'Missing required parameter: nametag',
      usage: 'GET /api/score?nametag=YourNametagHere',
      example: '/api/score?nametag=Agent_Alpha_01',
    });
  }

  const graph = scanNametag(nametag);
  const result = calculateScore(graph);

  return res.status(200).json({
    success: true,
    data: {
      score: result,
      transactionGraph: graph,
      paymentInfo: {
        cost: '0.5 testnet tokens',
        note: 'In production, a P2P payment request is issued before revealing this payload.',
      },
    },
  });
}
