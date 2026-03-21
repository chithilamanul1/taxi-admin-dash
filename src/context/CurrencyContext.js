'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

const CurrencyContext = createContext();

// Base currency is USD as requested (though prices are stored in LKR)
const BASE_CURRENCY = 'USD';

const SUPPORTED_CURRENCIES = [
    { code: 'LKR', symbol: 'Rs', name: 'Sri Lankan Rupee', flag: 'https://flagcdn.com/w40/lk.png' },
    { code: 'USD', symbol: '$', name: 'US Dollar', flag: 'https://flagcdn.com/w40/us.png' },
    { code: 'EUR', symbol: '€', name: 'Euro', flag: 'https://flagcdn.com/w40/eu.png' },
    { code: 'GBP', symbol: '£', name: 'British Pound', flag: 'https://flagcdn.com/w40/gb.png' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee', flag: 'https://flagcdn.com/w40/in.png' },
];

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState(BASE_CURRENCY);
    const [rates, setRates] = useState({ LKR: 1 });
    const [loading, setLoading] = useState(true);

    // Fetch Rates
    useEffect(() => {
        const fetchRates = async () => {
            try {
                // Using a free API for exchange rates based on LKR
                const res = await fetch('https://api.exchangerate-api.com/v4/latest/LKR');
                const data = await res.json();
                if (data && data.rates) {
                    setRates(data.rates);
                }
            } catch (error) {
                console.error('Failed to fetch exchange rates:', error);
            }
        };

        fetchRates();
    }, []);

    // Detect User Location & Currency
    useEffect(() => {
        const detectCurrency = async () => {
            try {
                // Check if user has already selected a currency
                const saved = localStorage.getItem('user_currency');
                if (saved && SUPPORTED_CURRENCIES.find(c => c.code === saved)) {
                    setCurrency(saved);
                    setLoading(false);
                    return;
                }

                // If not, detect by IP
                const res = await fetch('https://ipapi.co/json/');
                const data = await res.json();

                if (data.currency) {
                    // Check if the detected currency is supported, else default to USD (for foreigners) or LKR
                    const isSupported = SUPPORTED_CURRENCIES.find(c => c.code === data.currency);
                    if (isSupported) {
                        setCurrency(data.currency);
                    } else {
                        // If not supported (e.g. INR), maybe default to USD
                        setCurrency(data.country_code === 'LK' ? 'LKR' : 'USD');
                    }
                }
            } catch (error) {
                console.error('Failed to detect location:', error);
                setCurrency('USD'); // Fallback
            } finally {
                setLoading(false);
            }
        };

        detectCurrency();
    }, []);

    const changeCurrency = (code) => {
        if (SUPPORTED_CURRENCIES.find(c => c.code === code)) {
            setCurrency(code);
            localStorage.setItem('user_currency', code);
        }
    };

    const convertPrice = (lkrAmount) => {
        if (currency === 'LKR') return { value: Math.round(lkrAmount), symbol: 'Rs', code: 'LKR' };

        let rate = rates[currency];
        
        // Fallback rates if API fails to load or populate
        if (!rate) {
            const staticRates = { 'USD': 0.0032, 'EUR': 0.003, 'GBP': 0.0026, 'INR': 0.27 };
            rate = staticRates[currency];
        }

        if (!rate) return { value: Math.round(lkrAmount), symbol: 'Rs', code: 'LKR' };

        const convertedRaw = lkrAmount * rate;
        // Use 2 decimals for non-LKR currencies, but only if they aren't effectively whole numbers
        const converted = Number(convertedRaw.toFixed(2));
        
        const symbol = SUPPORTED_CURRENCIES.find(c => c.code === currency)?.symbol || currency;

        return { value: converted, symbol, code: currency };
    };

    return (
        <CurrencyContext.Provider value={{ currency, changeCurrency, convertPrice, rates, loading, SUPPORTED_CURRENCIES }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export const useCurrency = () => useContext(CurrencyContext);
