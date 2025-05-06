"use client"

import { useState, useEffect } from "react";

type History = {
  amount: number,
  type: string,
  status: string,
  timestamp?: string // Added timestamp if available
};

export default function ShowTransactionHistory() {
  const [histories, setHistories] = useState<History[]>([]);
  const [loading, setLoading] = useState(false); // Changed initial state to false
  const [accountNumber, setAccountNumber] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const[isClick,setIsClick]=useState<boolean>(false);

  const fetchHistories = async () => {
    if (!accountNumber) return; // Don't fetch if no account number
    
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `http://localhost:8080/api/transactions/history/${accountNumber}`,
        {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch transaction history');
      }

      const data = await response.json();
      setHistories(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      setHistories([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsClick(true);
    fetchHistories();
  };

  return (
    <div className="flex flex-col p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 bg-blue-100 rounded-md p-3 text-center">
        Transaction History
      </h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-4">
        <div>
          <label htmlFor="accountNumber" className="block mb-2 font-medium">
            Account Number
          </label>
          <input
            id="accountNumber"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Enter your account number"
            className="w-full p-2 border-2 border-blue-400 rounded-md focus:border-blue-700"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading || !accountNumber}
          className={`w-full p-2 rounded-md text-white ${
            loading || !accountNumber 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? 'Loading...' : 'View History'}
        </button>
      </form>

      {loading && (
        <div className="text-center py-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p>Loading transaction history...</p>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-4 bg-red-50 rounded-md">
          {error}
        </div>
      )}

      {!loading && isClick && !error && histories.length === 0 && accountNumber && (
        <div className="text-center py-4 text-gray-500">
          No transactions found for account {accountNumber}
        </div>
      )}

      {histories.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Transactions for account: {accountNumber}
          </h2>
          {histories.map((history, index) => (
            <div 
              key={index} 
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium capitalize">{history.type.toLowerCase()}</p>
                  <p className={`text-sm ${
                    history.status === 'SUCCESS' ? 'text-green-600' : 
                    history.status === 'FAILED' ? 'text-red-600' : 'text-yellow-600'
                  }`}>
                    Status: {history.status.toLowerCase()}
                  </p>
                </div>
                <p className={`text-lg font-bold ${
                  history.type === 'DEPOSIT' || history.type=== 'TRANSFER_IN' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {history.type === 'DEPOSIT' || history.type=== 'TRANSFER_IN' ? '+' : '-'}Rs {history.amount.toFixed(2)}
                </p>
              </div>
              {history.timestamp && (
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(history.timestamp).toLocaleString()}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}