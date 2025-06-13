import React from 'react';
import NavbarComponent from './Components/Navbar/NavbarComponent';
import { Route, Routes } from 'react-router-dom';
import Login from "./Components/Pages/Login/Login";
import SignUp from "./Components/Pages/SignUp/SignUp";
import WorkersDashboard from './Components/Dashboard/WorkersDashboard/WorkersDahboardMain/WorkersDashboard';
import CustomersDashboard from './Components/Dashboard/CustomersDashboard/CustomerDashboardMain/CustomersDashboard'
import Myprofile from './Components/Dashboard/WorkersDashboard/MyProfile/Myprofile';
import ViewProfiles from './Components/Dashboard/CustomersDashboard/ViewProfiles/ViewProfiles';
import MyRequests from './Components/Dashboard/CustomersDashboard/MyRequests/MyRequests';
import NewJobRequest from './Components/Dashboard/WorkersDashboard/NewJobRequest/NewJobRequest';

const App = () => {
  return (
    <div>
      <NavbarComponent />
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/signup' element={<SignUp />} />
        
        {/* Workers Dashboard Routes */}
        <Route path='/workersdashboard' element={<WorkersDashboard />}>
          <Route path='myprofile' element={<Myprofile />} />
          <Route path='newrequest' element={<NewJobRequest />} />
          
        </Route>
        
        {/* Customers Dashboard Route */}
        <Route path='/customersdashboard' element={<CustomersDashboard />} >
             <Route path='viewprofiles' element={<ViewProfiles />} />
             <Route path='myrequests' element={<MyRequests />} />
              
          </Route>

        
        {/* Optional: Add a redirect or 404 route */}
        {/* <Route path='*' element={<NotFound />} /> */}
      </Routes>
    </div>
  );
}

export default App;