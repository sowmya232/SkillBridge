import React from 'react'
import{Link, Outlet} from "react-router-dom"
import './WorkersDashboard.css';

const WorkersDashboard = () => {
  return (
    <div className='wokers_dashboard_parent'>
        <div id="left_side_options">
           <Link to="myprofile">Myprofile</Link>
           {/* <Link><h3>Active Jobs List</h3></Link>
           <Link><h3>New Job Requests</h3></Link>
           <Link><h3>Earnings</h3></Link> */}
        </div>
        <div id="main">
            <Outlet></Outlet>
        </div>
    </div>
  )
}

export default WorkersDashboard