import { TransactionGraph } from './scanner';

export interface CreditScoreResult {
  nametagId: string;
  score: number; // 0-100
  rating: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Sybil';
  reasons: string[];
}

export class ScoringEngine {
  public calculateScore(graph: TransactionGraph): CreditScoreResult {
    console.log(`[Scoring Engine] Calculating reputation index for ${graph.nametagId}...`);
    
    let score = 50; // Base score
    const reasons: string[] = [];

    // 1. Counterparty Diversity
    if (graph.uniqueCounterparties < 3) {
      score -= 30;
      reasons.push('Very low counterparty diversity (Sybil indicator)');
    } else if (graph.uniqueCounterparties > 20) {
      score += 20;
      reasons.push('High counterparty diversity');
    }

    // 2. AstridOS Sandbox Verification
    if (graph.isAstridOSVerified) {
      score += 15;
      reasons.push('Verified AstridOS Sandbox Execution');
    } else {
      reasons.push('Unverified execution environment');
    }

    // 3. Wallet Age
    if (graph.walletAgeDays < 7) {
      score -= 20;
      reasons.push('Extremely new wallet');
    } else if (graph.walletAgeDays > 180) {
      score += 10;
      reasons.push('Established wallet history');
    }

    // 4. Spam activity check (High txs, low volume)
    if (graph.transactionCount > 1000 && graph.totalVolume < 1) {
      score -= 40;
      reasons.push('High frequency, low value transactions (Spam indicator)');
    }

    // Bound score between 0 and 100
    score = Math.max(0, Math.min(100, score));

    let rating: CreditScoreResult['rating'] = 'Fair';
    if (score >= 80) rating = 'Excellent';
    else if (score >= 60) rating = 'Good';
    else if (score >= 40) rating = 'Fair';
    else if (score >= 20) rating = 'Poor';
    else rating = 'Sybil';

    console.log(`[Scoring Engine] Final Score: ${score} (${rating})`);
    
    return {
      nametagId: graph.nametagId,
      score,
      rating,
      reasons
    };
  }
}
