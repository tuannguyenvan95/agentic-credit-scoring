export interface Nametag {
  id: string;
  name: string;
  address: string;
}

export interface PaymentRequest {
  id: string;
  amount: number;
  currency: string;
  recipient: string;
  payer?: string;
  status: 'pending' | 'completed' | 'failed';
}

export interface MessagePayload {
  to: string;
  from: string;
  content: string;
  signature?: string;
}

export class SphereSDK {
  // Mock fetching identity
  public async getNametag(id: string): Promise<Nametag | null> {
    console.log(`[Sphere SDK] Fetching nametag for ${id}`);
    if (!id) return null;
    return {
      id,
      name: `Agent_${id.substring(0, 4)}`,
      address: `0x${id}`,
    };
  }

  // Mock issuing payment request
  public async createPaymentRequest(amount: number, recipient: string): Promise<PaymentRequest> {
    console.log(`[Sphere SDK] Creating payment request of ${amount} for ${recipient}`);
    return {
      id: `pr_${Date.now()}`,
      amount,
      currency: 'testnet_tokens',
      recipient,
      status: 'pending'
    };
  }

  // Mock verifying payment
  public async verifyPayment(requestId: string): Promise<boolean> {
    console.log(`[Sphere SDK] Verifying payment for ${requestId}... assuming success for mock`);
    return true; // Auto-succeed in mock
  }

  // Mock sending secure DM
  public async sendSecureMessage(payload: MessagePayload): Promise<boolean> {
    console.log(`[Sphere SDK] Sending secure DM to ${payload.to}`);
    // Simulate encryption and sending
    console.log(`[Sphere SDK] Message content: ${payload.content}`);
    return true;
  }
}
