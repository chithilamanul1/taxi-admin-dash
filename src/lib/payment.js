/**
 * Payment Gateway Abstraction Layer
 * 
 * This module provides a clean interface for payment processing.
 * To switch to Sampath Bank IPG:
 * 1. Set PAYMENT_GATEWAY=sampath in .env.local
 * 2. Add Sampath credentials to .env.local
 */

// Gateway Configuration
export const GATEWAY_CONFIG = {
    mock: {
        name: 'Mock Payment Gateway',
        enabled: true,
    },
    sampath: {
        name: 'Sampath Bank IPG',
        enabled: process.env.PAYMENT_GATEWAY === 'sampath',
        merchantId: process.env.SAMPATH_MERCHANT_ID || 'DEMO_MERCHANT',
        secretKey: process.env.SAMPATH_SECRET_KEY || 'DEMO_SECRET', // HMAC Secret
        paymentUrl: process.env.SAMPATH_PAYMENT_URL || 'https://sampath.paycorp.lk/webinterface/00000000-0000-0000-0000-000000000000/payment', // Example URL
    }
};

// Get active gateway
export function getActiveGateway() {
    return process.env.PAYMENT_GATEWAY || 'mock';
}

/**
 * Generate secure payload for Sampath IPG
 * Note: Payload structure depends on the specific IPG provider Sampath uses (e.g., PayCorp/Mastercard/Visa).
 * We will use a standard schema, but this might need adjustment based on specific documentation.
 */
export function generateSampathPayload(booking, returnUrl) {
    const config = GATEWAY_CONFIG.sampath;
    const amount = (booking.paidAmount || booking.totalPrice).toFixed(2);

    // Core parameters (Standard IPG fields)
    const payload = {
        merchant_id: config.merchantId,
        order_id: booking._id.toString(),
        amount: amount,
        currency: 'LKR',
        return_url: returnUrl,
        customer_email: booking.customerEmail || '',
        customer_phone: booking.guestPhone || '',
        description: `Booking #${booking._id.toString().slice(-6)}`,
    };

    // Generate Signature
    // String to sign format usually: merchant_id|order_id|amount|currency|secret
    // We will assume this standard format for now.
    const crypto = require('crypto');
    const stringToSign = `${payload.merchant_id}${payload.order_id}${payload.amount}${payload.currency}${config.secretKey}`;

    payload.hash = crypto.createHash('sha256').update(stringToSign).digest('hex').toUpperCase();

    return {
        action: config.paymentUrl,
        fields: payload
    };
}

// Verify Sampath callback signature
export function verifySampathSignature(data) {
    const config = GATEWAY_CONFIG.sampath;
    const crypto = require('crypto');

    // Construct string to sign from received data
    // Usually: merchant_id|order_id|amount|currency|status|secret
    // Adjust based on actual response fields
    const stringToSign = `${config.merchantId}${data.order_id}${data.amount}${data.currency}${data.status_code}${config.secretKey}`;

    const expectedHash = crypto.createHash('sha256').update(stringToSign).digest('hex').toUpperCase();

    return expectedHash === data.hash;
}
