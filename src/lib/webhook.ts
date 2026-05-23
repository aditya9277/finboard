// Webhook integration system for finboard
// Handles webhook event delivery with signature verification and retry logic

import crypto from 'crypto';

export type WebhookEvent = 'dashboard.updated' | 'widget.refreshed' | 'data.error' | 'alert.triggered';

export interface WebhookPayload {
  event: WebhookEvent;
  timestamp: string;
  data: unknown;
  dashboardId?: string;
  widgetId?: string;
}

export interface WebhookConfig {
  id: string;
  url: string;
  events: WebhookEvent[];
  secret: string;
  active: boolean;
  retryPolicy: RetryPolicy;
  headers?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface RetryPolicy {
  maxRetries: number;      // Maximum number of retry attempts
  initialDelay: number;    // Initial delay in milliseconds
  maxDelay: number;        // Maximum delay in milliseconds
  backoffMultiplier: number; // Exponential backoff multiplier
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  payload: WebhookPayload;
  attempt: number;
  status: 'pending' | 'delivered' | 'failed' | 'retrying';
  responseStatus?: number;
  responseBody?: string;
  nextRetryAt?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Generate HMAC-SHA256 signature for webhook payload
 */
export function generateWebhookSignature(payload: string, secret: string): string {
  return crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
}

/**
 * Verify webhook signature from incoming request
 */
export function verifyWebhookSignature(payload: string, signature: string, secret: string): boolean {
  const expectedSignature = generateWebhookSignature(payload, secret);
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

/**
 * Calculate next retry time with exponential backoff
 */
export function calculateNextRetryTime(
  attempt: number,
  retryPolicy: RetryPolicy
): Date {
  const delay = Math.min(
    retryPolicy.initialDelay * Math.pow(retryPolicy.backoffMultiplier, attempt - 1),
    retryPolicy.maxDelay
  );
  // Add jitter to prevent thundering herd
  const jitter = Math.random() * 0.1 * delay;
  return new Date(Date.now() + delay + jitter);
}

/**
 * Default retry policy for webhooks
 */
export const DEFAULT_RETRY_POLICY: RetryPolicy = {
  maxRetries: 5,
  initialDelay: 1000,      // 1 second
  maxDelay: 300000,        // 5 minutes
  backoffMultiplier: 2,
};

/**
 * Create webhook delivery headers with signature
 */
export function createWebhookHeaders(
  payload: WebhookPayload,
  secret: string,
  customHeaders?: Record<string, string>
): Record<string, string> {
  const payloadString = JSON.stringify(payload);
  const signature = generateWebhookSignature(payloadString, secret);

  return {
    'Content-Type': 'application/json',
    'X-Webhook-Signature': signature,
    'X-Webhook-Timestamp': payload.timestamp,
    ...customHeaders,
  };
}

/**
 * Validate webhook configuration
 */
export function validateWebhookConfig(config: Partial<WebhookConfig>): string[] {
  const errors: string[] = [];

  if (!config.url || !isValidUrl(config.url)) {
    errors.push('Invalid or missing webhook URL');
  }

  if (!config.events || config.events.length === 0) {
    errors.push('At least one event type must be selected');
  }

  if (!config.secret || config.secret.length < 32) {
    errors.push('Secret must be at least 32 characters long');
  }

  if (config.retryPolicy) {
    if (config.retryPolicy.maxRetries < 0 || config.retryPolicy.maxRetries > 10) {
      errors.push('Max retries must be between 0 and 10');
    }
    if (config.retryPolicy.backoffMultiplier < 1 || config.retryPolicy.backoffMultiplier > 5) {
      errors.push('Backoff multiplier must be between 1 and 5');
    }
  }

  return errors;
}

/**
 * Check if a string is a valid URL
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
