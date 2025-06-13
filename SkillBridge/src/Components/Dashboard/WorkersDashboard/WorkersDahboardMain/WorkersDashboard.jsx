import React from 'react'
import{Link, Outlet} from "react-router-dom"
import './WorkersDashboard.css';

const WorkersDashboard = () => {
  return (
    <div className='wokers_dashboard_parent'>
        <div id="left_side_options">
           <Link to="myprofile">My Profile</Link>
           <Link>Active Jobs List</Link>
           <Link to="newrequest">New Job Requests</Link>
           <Link>Earnings</Link>
        </div>
        <div id="main">
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default WorkersDashboard