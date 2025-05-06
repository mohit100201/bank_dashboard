"use client"

import { useState , useEffect } from "react";

export default function RegisterUser() {
  const [userName,setUserName]=useState<string>("");
  const [email,setEmail]      =useState<string>("");
  const [password,setPassword]=useState<string>("");
  const [role,setRole]=useState<string>("");
  const [success,setSuccess]=useState<string| null>(null);

  const handelSubmit=async(e:React.FormEvent)=>{
    e.preventDefault();

    const userData=
    {
      userName,
      email,
      password,
      role

    };

    try{
      const response= await fetch('http://localhost:8080/api/auth/register',{
        method:"POST",
        headers:{
          'Content-Type':'application/json'
        },
        body:JSON.stringify(userData)
        

      });

      if(!response.ok){
        console.log("Error occured: ");
        setSuccess("Registration Failed!")
        return;
      }

      const data= await response.json();

      console.log("token: ",data.token);
      localStorage.setItem('token',data.token)
      setSuccess("Registration Successfull!");


    }
    catch(error){
      console.error("Error is : ",error)
    }

   

  }

  
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccess(null);
     
    }, 900);

    return () => clearTimeout(timer); 
  }, [success]); 
  return (
    <div className="flex flex-col p-4 max-w-3xl mx-auto">
   <h1 className="text-2xl font-bold mb-6 shadow-md shadow-gray-200 bg-blue-100 rounded-md p-3 text-center">
        Register User
      </h1>
    <form onSubmit={handelSubmit}  className="mt-5 flex flex-col">

    <label htmlFor="UserName" className="block my-1 font-medium">
    UserName
          </label>
    <input
  className="border-2 border-blue-400 p-2 focus:border-2 focus:border-blue-700 rounded-md pl-1"
  type="text"
  id="UserName"
  name="UserName"
  required
  placeholder="Enter Username"
  onChange={(e) => setUserName(e.target.value)}
    />



    <label htmlFor="Email" className="block my-1 font-medium">
    Email
          </label>

     <input
  className="border-2 p-2  border-blue-400 focus:border-2 focus:border-blue-700 rounded-md  pl-1"
  type="email"
  name="Email"
  id="Email"
  required
  placeholder="Enter Email"
  onChange={(e) => setEmail(e.target.value)}
    />

<label htmlFor="Password" className="block my-1 font-medium">
    Password
          </label>

     <input
  className="border-2 p-2 border-blue-400 focus:border-2 focus:border-blue-700 rounded-md  pl-1"
  id="Password"
  type="password"
  name="Password"
  required
  placeholder="Enter Password"
  onChange={(e) => setPassword(e.target.value)}
    />

<label htmlFor="Role" className="block my-1 font-medium">
    Role
          </label>
     <input
  className="border-2 p-1 border-blue-400 focus:border-2 focus:border-blue-700 rounded-md  pl-1"
  type="text"
  name="Role"
  id="Role"
  required
  placeholder="Enter Role"
  onChange={(e) => setRole(e.target.value)}
    />

<input
  className="bg-blue-400 p-2 text-white rounded-md mt-3 pl-1"
  type="submit"
  
 
 
    />



    </form>

    {success && (
        <p className={`mt-3 flex flex-row justify-center  ${success==="Registration Success"?"text-green-700":"text-red-700"}`}>
          {success}
        </p>
      )}
      

   </div>
  );
}
