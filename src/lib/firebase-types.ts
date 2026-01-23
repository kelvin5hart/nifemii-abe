// Firestore document types

export interface User {
  id: string;
  phone: string;
  name?: string;
  email?: string;
  addresses?: Address[];
  measurements?: Measurements;
  isAdmin?: boolean;
  hasPassword?: boolean;
  passwordHash?: string;
  createdAt: Date;
  createdBy: "self" | "admin";
  updatedAt?: Date;
}

export interface Address {
  id: string;
  label: string; // e.g., "Home", "Office"
  street: string;
  city: string;
  state: string;
  landmark?: string;
  isDefault?: boolean;
}

export interface Measurements {
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  sleeveLength?: number;
  shirtLength?: number;
  neck?: number;
  trouserWaist?: number;
  trouserLength?: number;
  thigh?: number;
  ankle?: number;
  notes?: string;
  updatedAt?: Date;
}

export type OrderType = "ready-to-wear" | "full-bespoke" | "sew-only" | "bulk-bespoke";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "in-progress"
  | "ready"
  | "delivered"
  | "cancelled";

export type PaymentMethod = "paystack" | "cash" | "transfer";

export interface OrderItem {
  productId: string;
  productName: string;
  sku?: string; // Product SKU/code for easy reference
  size: string;
  quantity: number;
  price: number;
  image?: string;
}

export interface BulkRecipient {
  name: string;
  phone: string;
  measurements?: Measurements;
  size?: string;
  notes?: string;
}

export interface OrderPricing {
  subtotal: number;
  deliveryFee: number;
  discount?: {
    type: "percentage" | "fixed";
    value: number;
    reason: "sale" | "loyalty" | "other";
    note?: string;
  };
  totalAmount: number;
  depositAmount?: number;
  depositPaid?: boolean;
  depositMethod?: PaymentMethod;
  depositDate?: Date;
  depositPaymentRef?: string;
  balanceAmount?: number;
  balancePaid?: boolean;
  balanceMethod?: PaymentMethod;
  balanceDate?: Date;
  balancePaymentRef?: string;
  balancePaidTiming?: "before-delivery" | "after-delivery";
}

export interface ServiceDetails {
  styleDescription?: string;
  referenceImages?: string[];
  fabricProvided: boolean;
  fabricReceived?: boolean;
  fabricDescription?: string;
  fabricDetails?: string; // Fabric type, color, quantity for full bespoke
  completionDate?: string; // Expected completion date YYYY-MM-DD
}

export interface Order {
  id: string;
  userId: string;
  userPhone: string;
  userName?: string;
  type: OrderType;
  status: OrderStatus;
  dueDate?: string; // YYYY-MM-DD - Customer's requested delivery/completion date

  // For ready-to-wear
  items?: OrderItem[];

  // For bespoke/sew-only
  serviceDetails?: ServiceDetails;

  // For bulk orders
  recipients?: BulkRecipient[];

  // Measurements snapshot at order time
  measurements?: Measurements;

  // Pricing
  pricing: OrderPricing;

  // Delivery
  deliveryMethod: "pickup" | "delivery";
  deliveryAddress?: Address;

  // Payment
  paymentMethod: "online" | "offline" | "pay-on-delivery";

  // Metadata
  notes?: string;
  adminNotes?: string;
  createdBy: string; // userId or "admin"
  createdAt: Date;
  updatedAt: Date;
}

export type AppointmentType = "consultation" | "fitting" | "pickup" | "fabric-dropoff";

export type AppointmentStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "rescheduled";

export interface Appointment {
  id: string;
  userId: string;
  userPhone: string;
  userName?: string;
  type: AppointmentType;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:MM
  status: AppointmentStatus;
  notes?: string;
  adminNotes?: string;
  relatedOrderId?: string;
  createdBy: "customer" | "admin";
  createdAt: Date;
  updatedAt?: Date;
}

export interface Product {
  id: string;
  sku: string; // Unique product code, e.g., "NA-001"
  name: string;
  description: string;
  price: number;
  salePrice?: number;
  images: string[];
  category: string;
  sizes: Record<string, number>; // e.g., { "M": 2, "L": 1, "XL": 0 }
  colors?: string[];
  active: boolean;
  featured?: boolean;
  createdAt: Date;
  updatedAt?: Date;
}

export interface DeliverySettings {
  type: "flat" | "state-based" | "free";
  flatFee?: number;
  freeAbove?: number; // Free delivery for orders above this amount
  stateFees?: Record<string, number>;
  freeStates?: string[];
}

export interface BlockedTimeSlot {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:MM
  endTime: string; // HH:MM
  reason?: string; // Optional reason for blocking
}

export interface AvailabilitySettings {
  workingDays: string[]; // ["monday", "tuesday", ...]
  workingHours: {
    start: string; // "10:00"
    end: string; // "18:00"
  };
  slotDuration: number; // minutes
  blockedDates: string[]; // ["2026-02-14", ...] - Full day blocks
  blockedTimeSlots?: BlockedTimeSlot[]; // Partial day blocks
}

export interface Settings {
  delivery: DeliverySettings;
  availability: AvailabilitySettings;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  status: "new" | "read" | "replied";
  createdAt: Date;
  repliedAt?: Date;
}
