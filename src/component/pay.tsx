"use client"

import { useState, useEffect } from "react";

type Payment = {
    provider: string,
    fromAccount: string,
    toMerchant: string,
    amount: string
};

export default function Payment() {
  const [payment, setPayment] = useState<Payment>({
    provider: "",
    fromAccount: "",
    toMerchant: "",
    amount: ""
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("token",localStorage.getItem('token'))

    try {
      const response = await fetch('http://localhost:8080/api/payment/pay', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            provider: payment.provider,
            fromAccount: payment.fromAccount,
            toMerchant: payment.toMerchant,
            amount: Number(payment.amount)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Payment Failed");
      }

      const data = await response.text();
      console.log("data:",data);
      setSuccess(data);
    } catch (error: any) {
      console.error("Error:", error);
      setSuccess(error.message || "Payment failed");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
    }, 3000); 

    return () => clearTimeout(timer);
  }, [success]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen  p-4">
      <h1 className="text-2xl font-bold mb-6 bg-blue-100 rounded-md p-3">
        Payment
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-2">
        <div>
          <label htmlFor="Provider" className="block mb-1 font-medium">
           Provider
          </label>
          <input
            id="provider"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="text"
            required
            placeholder="Enter provider"
            value={payment.provider}
            onChange={(e) => setPayment({...payment, provider: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="FromAccount" className="block mb-1 font-medium">
          From Account
          </label>
          <input
            id="FromAccount"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="text"
            required
            placeholder="Enter From Account"
            value={payment.fromAccount}
            onChange={(e) => setPayment({...payment, fromAccount: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="ToMerchant" className="block mb-1 font-medium">
          To Merchant
          </label>
          <input
            id="ToMerchant"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="text"
            required
            placeholder="Enter To Merchant"
            value={payment.toMerchant}
            onChange={(e) => setPayment({...payment, toMerchant: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="Amount" className="block mb-1 font-medium">
          Amount (Rs)
          </label>
          <input
            id="Amount"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="Enter amount"
            value={payment.amount}
            onChange={(e) => setPayment({...payment, amount: e.target.value})}
          />
        </div>



        

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isLoading ? 'Creating...' : 'Pay'}
        </button>
      </form>

      {success && (
        <div className={`mt-4 p-2 rounded-md ${success.includes("success") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {success}
        </div>
      )}
    </div>
  );
}