
export type BillingPeriod = "monthly" | "yearly";

export interface PlanFeature {
  title: string;
  included: boolean;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  monthlyPrice: number;
  features: PlanFeature[];
  isPopular?: boolean;
  stripeMonthlyPriceId?: string;  // Stripe price ID for monthly billing
  stripeYearlyPriceId?: string;   // Stripe price ID for yearly billing
}

export interface UserSubscription {
  id: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'expired';
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  paymentMethod?: {
    brand: string;
    last4: string;
  };
  planName?: string;
  planPrice?: number;
  usage?: {
    events?: {
      used: number;
      total: number;
    };
  };
}

export interface SlotBroadcastHeaderProps {
  copyToClipboard: () => void;
  setActiveTab: (tab: string) => void;
  onCreateService: () => void;
  bookingLinks: Array<{
    id: string;
    service: string;
    link: string;
    createdAt: string;
  }>;
  onManageSlots: () => void;
}
