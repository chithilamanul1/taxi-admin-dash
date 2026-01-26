/**
 * Payment Gateway Abstraction Layer
 * 
 * This module provides a clean interface for payment processing.
 * Currently uses MOCK implementation. To switch to Sampath Bank IPG:
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
        enabled: false,
        // These will be filled from environment variables
        merchantId: process.env.SAMPATH_MERCHANT_ID || '',
        terminalId: process.env.SAMPATH_TERMINAL_ID || '',
        secretKey: process.env.SAMPATH_SECRET_KEY || '',
        // Sampath endpoints (update with actual URLs when available)
        sandboxUrl: 'https://sandbox.sampathbank.lk/ipg/payment',
        productionUrl: 'https://ipg.sampathbank.lk/payment',
    }
};

// Get active gateway
export function getActiveGateway() {
    const gateway = process.env.PAYMENT_GATEWAY || 'mock';
    return gateway;
}

// Generate payment request for Sampath IPG
export function generateSampathPayload(booking, returnUrl) {
    const config = GATEWAY_CONFIG.sampath;

    return {
        merchantId: config.merchantId,
        terminalId: config.terminalId,
        amount: booking.totalPrice.toFixed(2),
        currency: 'LKR',
        orderRef: booking._id.toString(),
        description: `Airport Taxi Booking #${booking._id.toString().slice(-6)}`,
        returnUrl: returnUrl,
        // Signature will be generated server-side using HMAC-SHA256
    };
}

// Verify Sampath callback signature
export function verifySampathSignature(payload, receivedSignature) {
    const crypto = require('crypto');
    const config = GATEWAY_CONFIG.sampath;

    // Construct string to sign (based on Sampath documentation)
    const stringToSign = `${payload.merchantId}|${payload.orderRef}|${payload.amount}|${payload.status}`;

    const expectedSignature = crypto
        .createHmac('sha256', config.secretKey)
        .update(stringToSign)
        .digest('hex');

    return expectedSignature === receivedSignature;
}
