"use client"

import { useState , useEffect } from "react";

type Users = {
    
  userEmail: string;
  userName: string;
  role: string;
  };

export default function ShowAllUsers(){

    const [users, setUsers] = useState<Users[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/user/all', {
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

  if (users.length === 0) {
    return <div className="text-center py-4">No accounts found</div>;
  }


    return(

        


        <div className="flex flex-col ">
        <p className=" flex flex-row  justify-center text-2xl font-bold mb-6 bg-blue-100 rounded-md mx-1  p-3">All Users</p>
        <div className=" flex flex-col ">
          {users.map((user,index) => (
            <div key={index} className="border rounded-lg p-4 my-3 mx-1 shadow-sm">
                <p>Id:{index+1}</p><br/>
                <p>Email: {user.userEmail}</p><br/>
                <p>Role: {user.role}</p><br/>
                <p>UserName: {user.userName}</p><br/>

              

            </div>
          ))}
        </div>
      </div>
    )
}