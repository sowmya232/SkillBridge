import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { signInWithEmailAndPassword } from 'firebase/auth';

// import { auth } from "./Components/ConfigFirebase/Config"

import {auth} from "../../ConfigFirebase/Config"



const Login = () => {

    const [login, setLogin] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    uid:''
  });

  const navigate = useNavigate();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setLogin(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const info = await signInWithEmailAndPassword(auth, login.email, login.password);
      console.log(info);
      console.log(info.user.uid)
      const nameValue = info.user.displayName || 'User';
      const uidValue = info.user.uid ||'User'
      const updatedLogin = { ...login, name: nameValue , uid:uidValue };

      alert('Login successful');

      if (updatedLogin.role === "worker") {
        localStorage.setItem("loggedInWorker", JSON.stringify(updatedLogin));
      } else {
        localStorage.setItem("loggedInCustomer", JSON.stringify(updatedLogin));
      }

      event.target.reset();
      setLogin({
        name: '',
        email: '',
        password: '',
        role: ''
      });

    navigate(`/${updatedLogin.role}sDashboard`);

    } catch (error) {
      console.error("Error details:", error.code, error.message);
      alert(`Login failed: ${error.message}. Please sign up if not registered or check your credentials.`);
    }
  };

  return (

    <>
         <div className="flex justify-center items-center h-[90vh] border-8 bg-gray-100">
         <div className="border-2 p-6 bg-white shadow-md rounded">
          <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="email"
              value={login.email}
              onChange={handleChange}
              required
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={login.password}
              onChange={handleChange}
              required
              className="w-full mb-4 p-2 border border-gray-300 rounded"
            />

            <select
            name="role"
            required
            value={login.role} onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Select Role</option>
            <option value="worker">Worker</option>
            <option value="customer">Customer</option>
          </select>

          <br />
          <br />
          
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              Login
            </button>
          </form>
          <div className="text-center mt-4">
            <p>
              Don't have an account? <Link to="/signup">SignUp Here</Link>
            </p>
          </div>
        </div>
      </div>
        
        
        
    </> 

  )
}

export default Login