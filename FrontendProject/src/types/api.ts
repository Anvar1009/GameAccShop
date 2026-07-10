// These interfaces mirror the backend DTOs exactly. Enum fields arrive as
// numbers (see src/lib/enums.ts). Property names are camelCase because
// System.Text.Json camelCases by default.

export interface LoginRequest {
  login: string;
  password: string;
}

export interface LoginResponse {
  userId: number;
  login: string;
  token: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  login: string;
  password: string;
  phoneNumber: string;
}

export interface RegisterResponse {
  userId: number;
  describtion: string; // (backend typo preserved)
}

// GetProductDTO
export interface Product {
  id: number;
  accStrength: number;
  playerCount: number;
  coinsCount: number;
  accPrice: number;
  description: string;
  tags: string[];
  medias: string[];
}

// OrderResponse (returned by POST /api/BuyerOrder)
export interface OrderResponse {
  orderId: number;
  productId: number;
  price: number;
  status: number;
  paymentStatus: number;
  paymentRequired: boolean;
  createdAt: string;
}

// BuyerOrderResponse
export interface BuyerOrder {
  orderId: number;
  productId: number;
  tags: string[];
  medias: string[];
  productTitle: string;
  productDescription: string;
  price: number;
  sellerId: number;
  sellerName: string;
  status: number;
  paymentStatus: number;
  createdAt: string;
}

// BuyerOrderDetailsResponse
export interface BuyerOrderDetails {
  orderId: number;
  productId: number;
  tags: string[];
  medias: string[];
  productTitle: string;
  productDescription: string;
  price: number;
  sellerId: number;
  sellerName: string;
  sellerPhone: string;
  status: number;
  paymentStatus: number;
  paymentMethod: number;
  createdAt: string;
  canConfirmOrder: boolean;
  canCancelOrder: boolean;
  canOpenChat: boolean;
  canOpenDispute: boolean;
}

// SellerOrderResponse
export interface SellerOrder {
  orderId: number;
  productId: number;
  productImage: string | null;
  productTitle: string;
  price: number;
  buyerId: number;
  buyerName: string;
  status: number;
  paymentStatus: number;
  createdAt: string;
  canOpenChat: boolean;
  canOpenDispute: boolean;
}

// SellerOrderDetailsResponse
export interface SellerOrderDetails {
  orderId: number;
  productId: number;
  tags: string[];
  medias: string[];
  productTitle: string;
  productDescription: string;
  price: number;
  buyerId: number;
  buyerName: string;
  buyerPhone: string;
  status: number;
  paymentStatus: number;
  paymentMethod: number;
  createdAt: string;
  canOpenChat: boolean;
  canOpenDispute: boolean;
}

// PaymentDetailsResponse
export interface PaymentDetails {
  paymentId: number;
  orderId: number;
  name: string;
  ownerName: string;
  cardNumber: string;
  amount: number;
  status: number;
  paymentMethod: number;
}

// PaymentStatusResponse
export interface PaymentStatusInfo {
  paymentId: number;
  status: number;
  orderStatus: number;
  confirmedAt: string | null;
  releasedAt: string | null;
}

// AdminPaymentResponse
export interface AdminPayment {
  paymentId: number;
  orderId: number;
  buyerName: string;
  sellerName: string;
  amount: number;
  paymentMethod: number;
  status: number;
  createdAt: string;
}

// AdminPaymentDetailsResponse
export interface AdminPaymentDetails {
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: number;
  status: number;
  createdAt: string;
  confirmedAt: string | null;
  releasedAt: string | null;
  buyerId: number;
  buyerName: string;
  buyerPhone: string;
  sellerId: number;
  sellerName: string;
  sellerPhone: string;
  productId: number;
  productDescription: string;
  strength: number;
  coins: number;
  playerCount: number;
  tags: string[];
  medias: string[];
  accountName: string;
  ownerName: string;
  cardNumber: string;
  receiptUrl: string | null;
  orderStatus: number;
  isBuyerConfirmed: boolean;
  isCompletedByAdmin: boolean;
  canConfirmPayment: boolean;
  canReleasePayment: boolean;
}

// AdminOrderResponse
export interface AdminOrder {
  orderId: number;
  price: number;
  status: number;
  createdAt: string;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  productId: number;
}

// AdminOrderDetailsResponse
export interface AdminOrderDetails {
  orderId: number;
  status: number;
  price: number;
  createdAt: string;
  buyerId: number;
  buyerName: string;
  buyerPhone: string;
  sellerId: number;
  sellerName: string;
  sellerPhone: string;
  productId: number;
  productDescription: string;
  accStrength: number;
  playerCount: number;
  coinsCount: number;
  tags: string[];
  medias: string[];
  paymentStatus: number;
  paymentMethod: number;
  paymentAmount: number;
  cardNumber: string;
  isBuyerConfirmed: boolean;
  isCompletedByAdmin: boolean;
  completedAt: string | null;
  chatRoomId: number;
  isChatOpened: boolean;
}

// ResponsePaymentAccount
export interface PaymentAccount {
  id: number;
  name: string;
  ownerName: string;
  method: number;
  accountNumber: string;
  isActive: boolean;
}

// CreateRequestPaymentAccount
export interface PaymentAccountRequest {
  name: string;
  ownerName: string;
  method: number;
  accountNumber: string;
}
