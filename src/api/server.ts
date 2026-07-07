import { SphereSDK, PaymentRequest } from '../sdk/sphere';
import { OnChainScanner } from '../core/scanner';
import { ScoringEngine, CreditScoreResult } from '../core/scoring';

export class ScoreServer {
  private activeRequests: Map<string, {
    clientAgentId: string;
    targetNametagId: string;
    scoreResult: CreditScoreResult;
  }> = new Map();

  constructor(
    private sdk: SphereSDK,
    private scanner: OnChainScanner,
    private scoring: ScoringEngine
  ) {}

  /**
   * Called when another agent wants to query a score.
   * Returns a Payment Request ID that the querying agent must fulfill.
   */
  public async handleScoreQueryRequest(clientAgentId: string, targetNametagId: string): Promise<PaymentRequest> {
    console.log(`[API] Received score query from ${clientAgentId} for target ${targetNametagId}`);
    
    // 1. Generate the payment request (0.5 testnet tokens)
    const pr = await this.sdk.createPaymentRequest(0.5, 'Scoring_Oracle_Agent');
    
    // 2. We can compute the score immediately or lazily. Let's compute it now and cache it.
    const graph = await this.scanner.scanNametag(targetNametagId);
    const scoreResult = this.scoring.calculateScore(graph);
    
    this.activeRequests.set(pr.id, {
      clientAgentId,
      targetNametagId,
      scoreResult
    });

    console.log(`[API] Payment request ${pr.id} created and sent to ${clientAgentId}`);
    return pr;
  }

  /**
   * Polls or is triggered by a webhook when a payment is completed.
   * For the mock, we will just call this manually to simulate payment completion.
   */
  public async handlePaymentCompleted(requestId: string): Promise<void> {
    const requestData = this.activeRequests.get(requestId);
    if (!requestData) {
      console.log(`[API] Unknown payment request ${requestId}`);
      return;
    }

    // Verify via SDK
    const isPaid = await this.sdk.verifyPayment(requestId);
    if (isPaid) {
      console.log(`[API] Payment ${requestId} verified. Releasing score to ${requestData.clientAgentId}...`);
      
      const payloadString = JSON.stringify(requestData.scoreResult);
      
      // Send the secure score payload over DM
      await this.sdk.sendSecureMessage({
        to: requestData.clientAgentId,
        from: 'Scoring_Oracle_Agent',
        content: `CREDIT_SCORE_PAYLOAD: ${payloadString}`,
        // Mock signature
        signature: `sig_${Buffer.from(payloadString).toString('base64').substring(0, 16)}`
      });

      this.activeRequests.delete(requestId);
      console.log(`[API] Score delivery complete for ${requestData.targetNametagId}.`);
    } else {
      console.log(`[API] Payment ${requestId} verification failed.`);
    }
  }
}
