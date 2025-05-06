"use client"

import { useState, useEffect } from "react";

type Transfer = {
    fromAccountNumber: string,
    toAccountNumber: string,
    amount: string,
    email: string

};

export default function Transfer() {
  const [transfer, setTransfer] = useState<Transfer>({
    fromAccountNumber: "",
    toAccountNumber: "",
    amount: "",
    email: ""
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("token",localStorage.getItem('token'))

    try {
      const response = await fetch('http://localhost:8080/api/transactions/async-transfer', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            fromAccountNumber: transfer.fromAccountNumber,
            toAccountNumber: transfer.toAccountNumber,
            amount: Number(transfer.amount),
            email: transfer.email
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Transfer Failed");
      }

      const data = await response.text();
      console.log("data:",data);
      setSuccess(data);
    } catch (error: any) {
      console.error("Error:", error);
      setSuccess(error.message || "Transfer failed");
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
        Transfer
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-2">
        <div>
          <label htmlFor="Email" className="block mb-1 font-medium">
          Email
          </label>
          <input
            id="Email"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="email"
            required
            placeholder="Enter Email"
            value={transfer.email}
            onChange={(e) => setTransfer({...transfer, email: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="From Account Number" className="block mb-1 font-medium">
          From Account Number
          </label>
          <input
            id="From Account Number"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="text"
            required
            placeholder="Enter From Account Number"
            value={transfer.fromAccountNumber}
            onChange={(e) => setTransfer({...transfer, fromAccountNumber: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="To Account Number" className="block mb-1 font-medium">
          To Account Number
          </label>
          <input
            id="To Account Number"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="text"
            required
            placeholder="Enter To Account Number"
            value={transfer.toAccountNumber}
            onChange={(e) => setTransfer({...transfer, toAccountNumber: e.target.value})}
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
            value={transfer.amount}
            onChange={(e) => setTransfer({...transfer, amount: e.target.value})}
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
        <div className={`mt-4 p-2 rounded-md ${success.includes("background") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {success}
        </div>
      )}
    </div>
  );
}