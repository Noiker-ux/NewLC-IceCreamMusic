export type TSuccessionResponse = {
  success: true;
};

export type TAmount = {
  value: string;
  currency: string;
};

export type TStatus =
  | 'pending'
  | 'waiting_for_capture'
  | 'succeeded'
  | 'canceled';

export type TPayment = {
  id: string;
  status: TStatus;
  amount: TAmount;
  income_amount?: TAmount;
  description?: string;
  recipient: {
    account_id: string;
    gateway_id: string;
  };
  receipt?: {
    customer?: {
      full_name?: string;
      inn?: string;
      email?: string;
      phone?: string;
    };
    items: {
      description: string;
      amount: TAmount;
      vat_code: number;
      quantity: string;
      measure?: string;
      payment_subject?: string;
      payment_mode?: string;
      country_of_origin_code?: string;
      customs_declaration_number?: string;
      excise?: string;
      product_code?: string;
      mark_code_info?: unknown;
      mark_mode?: string;
      payment_subject_industry_details?: string;
    }[];
    phone?: string;
    email?: string;
  };
  payment_method?: {
    type: 'bank_card';
    id: string;
    saved: boolean;
    status: 'pending' | 'active' | 'inactive';
    title?: string;
    card?: {
      first6: string;
      expiry_year: string;
      expiry_month: string;
      card_type: string;
      card_product?: {
        code: string;
        name?: string;
      };
      issuer_country?: string;
      issuer_name?: string;
      source?: string;
    };
  };
  captured_at?: string;
  created_at: string;
  expires_at?: string;
  confirmation?: {
    type: 'redirect';
    confirmation_url: string;
    enforce?: boolean;
    return_url?: string;
  };
  test: boolean;
  refunded_amount?: TAmount;
  paid: boolean;
  refundable: boolean;
  receipt_registration?: string;
  metadata?: unknown;
  cancellation_details?: {
    party: string;
    reason: string;
  };
  authorization_details?: {
    rrn?: string;
    auth_code?: string;
    three_d_secure: {
      applied: boolean;
    };
  };
  transfers?: {
    account_id: string;
    amount: TAmount;
    status: TStatus;
    platform_fee_amount?: TAmount;
    description?: string;
    metadata?: string;
  };
  deal?: {
    id: string;
    settlements: { type: 'payout'; amount: TAmount }[];
  };
  merchant_customer_id?: string;
  invoice_details?: {
    id?: string;
  };
};
