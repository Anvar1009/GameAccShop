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

// ── Chat (SignalR + REST) ────────────────────────────────────────────
// MessageResponse. Note: the SignalR "ReceiveMessage" broadcast does not set
// `isMine` reliably (it is false for every recipient), so the client recomputes
// it from the current user id — see chat-hooks. Treat `isMine` here as a hint.
export interface ChatMessage {
  id: number;
  senderId: number;
  conversationId: number;
  senderName: string;
  text: string;
  isMine: boolean;
  /** True once the other participant has seen it — drives the read ticks. */
  isRead: boolean;
  createdAt: string;
}

// ConversationResponse
export interface ChatConversation {
  conversationId: number;
  orderId: number;
  isClosed: boolean;
  messages: ChatMessage[];
}

// SendMessageRequest (Hub + POST /api/Chat)
export interface SendChatMessage {
  orderId: number;
  text: string;
}

// ── Notifications (SignalR + REST) ───────────────────────────────────
// NotificationResponse. `title`/`message` are the server's Uzbek fallback text;
// the UI renders localized copy keyed off `notificationType` instead (see
// notificationMeta in src/lib/enums.ts) and falls back to these for a type it
// does not know.
export interface AppNotification {
  id: number;
  title: string;
  message: string;
  notificationType: number;
  /** NotificationAudience — whether I am the buyer, seller or admin here. */
  audience: number;
  isRead: boolean;
  createdAt: string;
  /** The order this notification is about — drives the click-through link. */
  orderId: number | null;
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

// RegistrationTrendPoint
export interface RegistrationTrendPoint {
  date: string;
  count: number;
}

// AdminStatsResponse
export interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  activeProducts: number;
  reservedProducts: number;
  soldProducts: number;
  deletedProducts: number;
  userRegistrationTrend: RegistrationTrendPoint[];
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

// DisputeEvidenceResponse
export interface DisputeEvidenceItem {
  id: number;
  uploadedById: number;
  uploadedByName: string;
  url: string;
  type: number;
  createdAt: string;
}

// DisputeResponse
export interface Dispute {
  id: number;
  orderId: number;
  orderStatus: number;
  productId: number;
  productDescription: string;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
  openedById: number;
  openedByName: string;
  reason: string;
  adminComment: string | null;
  status: number;
  createdAt: string;
  resolvedAt: string | null;
  evidence: DisputeEvidenceItem[];
}

// DisputeListResponse
export interface DisputeListItem {
  id: number;
  orderId: number;
  openedById: number;
  openedByName: string;
  reason: string;
  status: number;
  createdAt: string;
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
