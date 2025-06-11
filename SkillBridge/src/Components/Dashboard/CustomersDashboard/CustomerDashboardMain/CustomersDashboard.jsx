import React from 'react'
import{Link, Outlet} from "react-router-dom"
import './CustomersDashboard.css';

const CustomersDashboard = () => {
   
  return (
     <div className='customers_dashboard_parent'>
        <div id="left_side_options">
           <Link to="viewprofiles">View Profiles</Link>
            <Link to="myrequests">My Requests</Link>
           
        </div>
        <div id="main">
            <Outlet></Outlet>
        </div> 
    </div>
  )
}

export default CustomersDashboard


