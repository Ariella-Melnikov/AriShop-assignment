export interface Payment {
    _id: string;
    orderId: string;
    provider: 'unipaas';
    transactionId: string;
    amount: number;
    status: 'pending' | 'completed' | 'failed';
    timestamp: Date;
    details?: Record<string, any>; 
  }