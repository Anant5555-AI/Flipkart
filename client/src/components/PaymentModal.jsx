import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentModal = ({ isOpen, onClose, onPay, amount }) => {
    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [loading, setLoading] = useState(false);

    const handlePay = async (e) => {
        e.preventDefault();
        setLoading(true);

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        setLoading(false);
        onPay(); // Trigger parent success logic
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                />

                {/* Modal */}
                <motion.div
                    initial={{ scale: 0.95, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.95, opacity: 0, y: 20 }}
                    className="relative w-full max-w-md bg-white rounded-xl shadow-2xl overflow-hidden"
                >
                    {/* Header */}
                    <div className="bg-[#2874f0] p-6 text-white text-center">
                        <h3 className="text-xl font-bold">Secure Payment</h3>
                        <p className="text-blue-100 text-sm mt-1">Complete your purchase of ₹{amount?.toLocaleString()}</p>
                        <div className="absolute top-4 right-4 text-white/80 text-xs font-mono">
                            TEST MODE
                        </div>
                    </div>

                    {/* Form */}
                    <form onSubmit={handlePay} className="p-6 space-y-4">
                        {/* Card Number */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Card Number</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="0000 0000 0000 0000"
                                    maxLength="19"
                                    className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2874f0] focus:ring-0 transition-colors bg-gray-50 font-mono text-gray-700"
                                    value={cardNumber}
                                    onChange={(e) => {
                                        // Format as 0000 0000 0000 0000
                                        let v = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                                        const matches = v.match(/\d{4,16}/g);
                                        const match = matches && matches[0] || '';
                                        const parts = [];
                                        for (let i = 0, len = match.length; i < len; i += 4) {
                                            parts.push(match.substring(i, i + 4));
                                        }
                                        if (parts.length) {
                                            setCardNumber(parts.join(' '));
                                        } else {
                                            setCardNumber(v);
                                        }
                                    }}
                                    required
                                />
                                <div className="absolute left-3 top-2.5 text-gray-400">
                                    💳
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {/* Expiry */}
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">Expiry</label>
                                <input
                                    type="text"
                                    placeholder="MM/YY"
                                    maxLength="5"
                                    className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2874f0] focus:ring-0 transition-colors bg-gray-50 text-center"
                                    value={expiry}
                                    onChange={(e) => setExpiry(e.target.value)}
                                    required
                                />
                            </div>

                            {/* CVV */}
                            <div className="flex-1">
                                <label className="block text-xs font-semibold text-gray-500 uppercase mb-1">CVV</label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        placeholder="123"
                                        maxLength="3"
                                        className="w-full pl-8 pr-4 py-2 border-2 border-gray-200 rounded-lg focus:border-[#2874f0] focus:ring-0 transition-colors bg-gray-50 text-center"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        required
                                    />
                                    <div className="absolute left-3 top-2.5 text-gray-400">
                                        🔒
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Total Row */}
                        <div className="flex justify-between items-center py-4 border-t border-gray-100 mt-4">
                            <span className="text-gray-500 font-medium">Total Payable</span>
                            <span className="text-2xl font-bold text-gray-800">₹{amount?.toLocaleString()}</span>
                        </div>

                        {/* Pay Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#fb641b] text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition-all transform active:scale-95 disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg"
                        >
                            {loading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </>
                            ) : (
                                `PAY ₹${amount?.toLocaleString()}`
                            )}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-2">
                            🔒 This is a secure 256-bit SSL encrypted payment
                        </p>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default PaymentModal;
