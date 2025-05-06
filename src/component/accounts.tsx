"use client"

import { useState, useEffect } from "react";

type AccountData = {
  accountType: string;
  initialDeposit: string; 
};

export default function AccountCreate() {
  const [accountData, setAccountData] = useState<AccountData>({
    accountType: "",
    initialDeposit:""
  });
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("token",localStorage.getItem('token'))

    try {
      const response = await fetch('http://localhost:8080/api/accounts/create', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          accountType: accountData.accountType,
          initialDeposit: Number(accountData.initialDeposit)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create account");
      }

      const data = await response.json();
      setSuccess("Account Created Successfully!");
    } catch (error: any) {
      console.error("Error:", error);
      setSuccess(error.message || "Account creation failed");
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
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-6 bg-blue-100 rounded-md p-3">
        Create Account
      </h1>
      
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
        <div>
          <label htmlFor="accountType" className="block mb-1 font-medium">
            Account Type
          </label>
          <input
            id="accountType"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="text"
            required
            placeholder="Enter account type"
            value={accountData.accountType}
            onChange={(e) => setAccountData({...accountData, accountType: e.target.value})}
          />
        </div>

        <div>
          <label htmlFor="initialDeposit" className="block mb-1 font-medium">
            Initial Deposit (Rs)
          </label>
          <input
            id="initialDeposit"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            type="number"
            min="0"
            step="0.01"
            required
            placeholder="Enter amount"
            value={accountData.initialDeposit}
            onChange={(e) => setAccountData({...accountData, initialDeposit: e.target.value})}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-2 rounded-md ${isLoading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
        >
          {isLoading ? 'Creating...' : 'Create Account'}
        </button>
      </form>

      {success && (
        <div className={`mt-4 p-2 rounded-md ${success.includes("Successfully") ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {success}
        </div>
      )}
    </div>
  );
}