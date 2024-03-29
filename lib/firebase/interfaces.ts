export interface CheckoutItems {
  item: Item;
  quantity: number;
}

export interface Shop {
  id: string;
  walletAddress: string;
  name: string;
  city: string;
  country: string;
  address: string;
}

export interface Item {
  id: string;
  name: string;
  price: number;
  emoji: string;
  shopId: string;
}


export interface Checkout {
  id: string;
  shopId: string;
  items: CheckoutItems[];
  createdAt: Date;
  shop?: Shop;
  requestId?: string;
  amount?: number;
  payerAddress?: string;
}
