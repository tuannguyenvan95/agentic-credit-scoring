import { SphereSDK, Nametag } from '../sdk/sphere';

export interface TransactionGraph {
  nametagId: string;
  transactionCount: number;
  uniqueCounterparties: number;
  totalVolume: number;
  walletAgeDays: number;
  isAstridOSVerified: boolean;
}

export class OnChainScanner {
  constructor(private sdk: SphereSDK) {}

  public async scanNametag(nametagId: string): Promise<TransactionGraph> {
    console.log(`[Scanner] Initiating behavioral scan for ${nametagId}...`);
    
    // Simulate fetching on-chain data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate some mock data based on the ID for determinism in testing
    const hash = this.simpleHash(nametagId);
    
    // Even hashes simulate a likely Sybil, odd simulate a genuine user
    const isSybilLikely = hash % 2 === 0;

    const data: TransactionGraph = {
      nametagId,
      transactionCount: isSybilLikely ? 5000 : Math.max(10, hash % 100), 
      uniqueCounterparties: isSybilLikely ? 2 : Math.max(5, hash % 50),
      totalVolume: isSybilLikely ? 0.01 : (hash % 1000) + 10,
      walletAgeDays: isSybilLikely ? 1 : Math.max(30, hash % 365),
      isAstridOSVerified: !isSybilLikely,
    };

    console.log(`[Scanner] Scan complete for ${nametagId}.`);
    return data;
  }

  private simpleHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash);
  }
}
