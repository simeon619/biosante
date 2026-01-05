
import axios from 'axios';
import { CartItem, DeliveryEstimate } from '../types';

const API_URL = 'http://localhost:3333/api';

/**
 * Payment initiation response
 */
interface PaymentInitResponse {
    orderId: string;
    checkoutUrl?: string; // Optional for cash on delivery
    total: number;
    transactionRef?: string;
}


/**
 * Payment verification response
 */
interface PaymentVerifyResponse {
    status: 'success' | 'pending' | 'failed' | 'cancelled' | 'initiated';
    manualStatus?: 'pending' | 'verifying' | 'success' | 'failed';
    transactionRef?: string;
    proofImage?: string;
    order: {
        id: string;
        customerName: string;
        total: number;
        status: string;
        items: CartItem[];
    };
}

export const api = {
    /**
     * Estimate delivery fee based on address and cart total
     */
    estimateDelivery: async (address: string, cartTotal: number): Promise<DeliveryEstimate | null> => {
        try {
            const response = await axios.post(`${API_URL}/deliveries/estimate`, {
                address,
                cartTotal
            });
            return response.data;
        } catch (error) {
            console.error('Error estimating delivery:', error);
            return null;
        }
    },

    /**
     * Search for places
     */
    searchPlaces: async (query: string) => {
        try {
            const response = await axios.get(`${API_URL}/deliveries/search`, {
                params: { query }
            });
            return response.data;
        } catch (error) {
            console.error('Error searching places:', error);
            return [];
        }
    },

    /**
     * Create a delivery for a confirmed order
     */
    createDelivery: async (data: {
        orderId: string;
        address: string;
        lat: number;
        lon: number;
        fee: number;
        customerName: string;
        customerPhone: string;
        shippingCompany?: string;
        shippingCity?: string;
    }) => {
        try {
            const response = await axios.post(`${API_URL}/deliveries/create`, data);
            return response.data;
        } catch (error) {
            console.error('Error creating delivery:', error);
            throw error;
        }
    },

    /**
     * Initiate payment with Moneroo
     * Creates order and returns checkout URL for redirect
     */
    initiatePayment: async (data: {
        cart: CartItem[];
        customer: {
            name: string;
            phone: string;
            email?: string;
        };
        delivery: {
            address: string;
            lat: number;
            lon: number;
            fee: number;
            addressNote?: string;
            shippingCompany?: string;
            shippingCity?: string;
        };
        paymentMethod?: 'online' | 'cash' | 'manual' | 'wave';
        deliveryMode?: 'local' | 'shipping';
        serviceCode?: string;
    }): Promise<PaymentInitResponse> => {
        const userId = typeof window !== 'undefined' ? localStorage.getItem('user_id') : null;
        const response = await axios.post(`${API_URL}/payments/initiate`, data, {
            headers: userId ? { 'X-User-Id': userId } : {}
        });
        return response.data;
    },


    /**
     * Verify payment status
     * Called when customer returns from Moneroo checkout
     */
    verifyPayment: async (paymentId?: string, orderId?: string): Promise<PaymentVerifyResponse> => {
        const params: Record<string, string> = {};
        if (orderId) params.orderId = orderId;

        const url = paymentId
            ? `${API_URL}/payments/verify/${paymentId}`
            : `${API_URL}/payments/verify`;

        const response = await axios.get(url, { params });
        return response.data;
    },

    /**
     * Upload payment proof screenshot
     */
    async uploadProof(orderId: string, file: File): Promise<{ message: string; proofImage: string }> {
        const formData = new FormData();
        formData.append('orderId', orderId);
        formData.append('image', file);

        const response = await axios.post(`${API_URL}/payments/proof`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    async submitReference(data: {
        orderId: string;
        provider: string;
        reference: string;
        amount: number;
    }) {
        const response = await axios.post(`${API_URL}/payments/submit-reference`, data);
        return response.data;
    },

    // --- Authentication & Account ---

    async register(data: any) {
        const response = await axios.post(`${API_URL}/auth/register`, data);
        return response.data;
    },

    async login(data: any) {
        const response = await axios.post(`${API_URL}/auth/login`, data);
        return response.data;
    },

    async sendOtp(phone: string) {
        const response = await axios.post(`${API_URL}/auth/send-otp`, { phone });
        return response.data;
    },

    async verifyOtp(phone: string, otp: string) {
        const response = await axios.post(`${API_URL}/auth/verify-otp`, { phone, otp });
        return response.data;
    },

    async getMe(userId: string) {
        const response = await axios.get(`${API_URL}/auth/me`, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async getOrders(userId: string) {
        const response = await axios.get(`${API_URL}/auth/orders`, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async updateProfile(userId: string, data: any) {
        const response = await axios.patch(`${API_URL}/auth/profile`, data, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async addAddress(userId: string, data: any) {
        const response = await axios.post(`${API_URL}/auth/addresses`, data, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async updateAddress(userId: string, addressId: string, data: any) {
        const response = await axios.patch(`${API_URL}/auth/addresses/${addressId}`, data, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async deleteAddress(userId: string, addressId: string) {
        const response = await axios.delete(`${API_URL}/auth/addresses/${addressId}`, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    async setDefaultAddress(userId: string, addressId: string) {
        const response = await axios.patch(`${API_URL}/auth/addresses/${addressId}/default`, {}, {
            headers: { 'X-User-Id': userId }
        });
        return response.data;
    },

    // --- OTP Phone Change ---

    async requestPhoneChangeOtp(userId: string, newPhone: string) {
        const response = await axios.post(`${API_URL}/otp/request-phone-change`, {
            userId,
            newPhone
        });
        return response.data;
    },

    async verifyPhoneChangeOtp(userId: string, otp: string, newPhone: string) {
        const response = await axios.post(`${API_URL}/otp/verify-phone-change`, {
            userId,
            otp,
            newPhone
        });
        return response.data;
    }
};
