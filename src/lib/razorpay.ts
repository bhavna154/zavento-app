export interface RazorpayCustomerDetails {
  name: string;
  email: string;
  contact?: string;
  address?: string;
  city?: string;
  zip?: string;
}

export interface RazorpayPaymentSuccess {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

export interface RazorpayErrorResponse {
  code: string;
  description: string;
  source: string;
  step: string;
  reason: string;
  metadata: Record<string, any>;
}

// Razorpay API Key ID placeholder. Replace with your actual Key ID from Razorpay Dashboard.
export const RAZORPAY_KEY_ID: string =
  ((import.meta as any).env?.VITE_RAZORPAY_KEY_ID as string) || 'rzp_test_placeholder_key_id';

/**
 * Dynamically loads the official Razorpay Checkout script if not already present.
 */
export function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]'
    );

    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(true));
      existingScript.addEventListener('error', () => resolve(false));
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

/**
 * Opens the Razorpay payment modal with UPI, Cards, Netbanking, & International support.
 */
export async function openRazorpayCheckout({
  amount,
  customer,
  onSuccess,
  onDismiss,
  onError,
}: {
  amount: number; // Total order amount in USD
  customer: RazorpayCustomerDetails;
  onSuccess: (payment: RazorpayPaymentSuccess) => void;
  onDismiss?: () => void;
  onError?: (err: string) => void;
}): Promise<void> {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    if (onError) onError('Could not load Razorpay SDK. Please check your internet connection.');
    return;
  }

  // Convert USD to INR paise (Razorpay standard for UPI, Netbanking & Cards)
  // 1 USD approx = 83 INR; 1 INR = 100 paise
  const currency = ((import.meta as any).env?.VITE_RAZORPAY_CURRENCY as string) || 'INR';
  const amountInINR = Math.round(amount * 83);
  const amountInSubunits = currency === 'INR' ? amountInINR * 100 : Math.round(amount * 100);

  // If using placeholder key and user is testing in development/preview:
  const isPlaceholderKey =
    !RAZORPAY_KEY_ID ||
    RAZORPAY_KEY_ID === 'rzp_test_placeholder_key_id' ||
    RAZORPAY_KEY_ID === 'YOUR_RAZORPAY_KEY_ID';

  const options: Record<string, any> = {
    key: RAZORPAY_KEY_ID,
    amount: amountInSubunits,
    currency: currency,
    name: 'Zavento Merch',
    description: `Order Payment ($${amount.toFixed(2)} USD ≈ ₹${amountInINR.toLocaleString('en-IN')})`,
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=128&q=80',
    prefill: {
      name: customer.name || 'Zavento Customer',
      email: customer.email || 'customer@example.com',
      contact: customer.contact || '9876543210',
    },
    notes: {
      address: `${customer.address || ''}, ${customer.city || ''} ${customer.zip || ''}`,
      store: 'Zavento Print on Demand',
    },
    theme: {
      color: '#E8821C', // Zavento brand orange
    },
    modal: {
      ondismiss: () => {
        if (onDismiss) {
          onDismiss();
        }
      },
    },
    handler: (response: RazorpayPaymentSuccess) => {
      onSuccess(response);
    },
  };

  try {
    const rzp = new (window as any).Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      const errorMsg =
        response?.error?.description || 'Payment failed with Razorpay. Please try again.';
      if (onError) onError(errorMsg);
    });
    rzp.open();
  } catch (err: any) {
    if (isPlaceholderKey) {
      if (onError) {
        onError(
          'Razorpay is in placeholder mode (VITE_RAZORPAY_KEY_ID is not set). Please add your actual Razorpay Key ID in .env'
        );
      }
    } else {
      if (onError) onError(err?.message || 'Error opening Razorpay checkout.');
    }
  }
}
