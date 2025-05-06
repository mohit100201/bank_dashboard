"use client"

import { useState , useEffect } from "react";

type Users = {
    
  userEmail: string;
  userName: string;
  role: string;
  };

export default function ShowUser(){

    const [users, setUsers] = useState<Users>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/me', {
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
        setUsers(data);
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

  


    return(
        <div className="flex flex-col ">
        <p className=" flex flex-row  justify-center text-2xl font-bold mb-6 bg-blue-100 rounded-md mx-1  p-3">My Profile</p>
        <div className=" flex flex-col ">
         
            <div className="border rounded-lg p-4 my-3 mx-1 shadow-sm">
                
                {users && (
                  <>
                    <p>Email: {users.userEmail}</p><br/>
                    <p>Role: {users.role}</p><br/>
                    <p>UserName: {users.userName}</p><br/>
                  </>
                )}

              

            </div>
          
        </div>
      </div>

        


     
    )
}