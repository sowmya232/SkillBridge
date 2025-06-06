import React, { useState } from 'react';
import { auth , db } from '../../ConfigFirebase/Config';

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import {  doc, setDoc } from "firebase/firestore";

import { useNavigate } from 'react-router-dom';



const Signup = () => {

   const [signUp, setSignUp] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    uid:''
  });

 const navigate = useNavigate()

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSignUp({
      ...signUp,
      [name]: value
    });
  };

  const handleRegister = async (e)=>{
    e.preventDefault()
    try{
        const accountDetails =  await createUserWithEmailAndPassword(auth, signUp.email, signUp.password);

        console.log(accountDetails.user.uid)

        await updateProfile(accountDetails.user , {
          displayName:signUp.name
        })

               // doc - > to make a doc
               // setDoc -> to make a room for that doc in data base
               
        await setDoc(doc(db, `${signUp.role}s` , `${accountDetails.user.uid}`) , {
                name:signUp.name,
                email:signUp.email,
                role:signUp.role,
                uid:accountDetails.user.uid,
                id:Date.now()
                } )
            
         alert('Sign up successfull')
                
         setSignUp({
                name: '',
                email: '',
                password: '',
                role: ''
              }); 

              
           navigate("/login")    
            }
            catch(error){
              alert(error);
            }
     
            
          }
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-[320px] bg-white border-2 p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            required
             value={signUp.name}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
             value={signUp.email}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
             value={signUp.password}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          />
          
          <select
            name="role"
            required
             value={signUp.role}
            onChange={handleChange}
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Role</option>
            <option value="worker">Worker</option>
            <option value="customer">Customer</option>
          </select>
          
          <button
            type="submit"
            className="bg-green-500 text-white py-2 rounded hover:bg-green-600"
          >
            Sign Up
          </button>
        </form>
        
        <div className="text-center mt-4">
          <p>
            Already have an account?{' '}
            <a href="#" className="text-blue-500 underline">Login</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
