"use client"

import { useState , useEffect } from "react";

type Account = {
    accountType: string;
    id: string;
    balance: number;
  };

export default function ShowAllAcounts(){

    const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/accounts', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch accounts');
        }

        const data = await response.json();
        console.log("data: ",data);
        setAccounts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (loading) {
    return <div className="text-center py-4">Loading accounts...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center py-4">{error}</div>;
  }

  if (accounts.length === 0) {
    return <div className="text-center py-4">No accounts found</div>;
  }


    return(

        


        <div className="flex flex-col ">
        <p className=" flex flex-row  justify-center text-2xl font-bold mb-6 bg-blue-100 rounded-md mx-1  p-3">Your Accounts</p>
        <div className=" flex flex-col ">
          {accounts.map((account,index) => (
            <div key={index} className="border rounded-lg p-4 my-3 mx-1 shadow-sm">
              <p className="text-gray-600 text-sm">Account #: {index+1}</p>
              <h3 className="font-semibold capitalize">{account.accountType.toLowerCase()} Account</h3>
              <p className="text-lg font-medium mt-2">
                Balance: Rs {account.balance.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>
    )
}