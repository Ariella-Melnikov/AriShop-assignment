export interface DeliveryMethod {
    _id: string;
    carrier: string;
    method: string;
    estimatedDeliveryWindow: {
      from: Date;
      to: Date;
    };
    price: number;
    areaDescription?: string;
  }