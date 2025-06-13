import React from 'react'
import { useEffect, useState } from 'react';
import { collection, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/Config';


let loggedInUser = JSON.parse(localStorage.getItem('loggedInCustomer'));

const MyRequests = () => {

   const [requests, setRequests] = useState([]);

  useEffect(()=>{
    const fetchRequest = async() =>{
        const userRef = doc(db, "customers", `${loggedInUser.uid}`)
        const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRequests(userData.bookings || []);
          }

        }

   
    fetchRequest()
  }, [])



const handleCancel = async (index) => {
  try {
    const customerRef = doc(db, "customers", loggedInUser.uid);
    const customerSnap = await getDoc(customerRef);

    if (customerSnap.exists()) {
      const customerData = customerSnap.data();
      const updatedCustomerBookings = [...customerData.bookings];

      const bookingToCancel = updatedCustomerBookings[index];
      bookingToCancel.status = "Rejected";

      // Update the current customer's bookings
      await updateDoc(customerRef, {
        bookings: updatedCustomerBookings,
      });

      // Get the workerId from this booking
      const workerId = bookingToCancel.workerId;
      const workerRef = doc(db, "customers", workerId);
      const workerSnap = await getDoc(workerRef);

      if (workerSnap.exists()) {
        const workerData = workerSnap.data();
        const updatedWorkerBookings = [...workerData.bookings];

        updatedWorkerBookings.forEach((booking) => {
          if (
            booking.customerId === loggedInUser.uid &&
            booking.serviceId === bookingToCancel.serviceId
          ) {
            booking.status = "Rejected";
          }
        });

        await updateDoc(workerRef, {
          bookings: updatedWorkerBookings,
        });
      }

      // Update local state
      const updatedStateBookings = [...requests];
      updatedStateBookings[index].status = "Rejected";
      setRequests(updatedStateBookings);

      alert("Canceled request #" + (index + 1));
    }
  } catch (error) {
    console.error("Error cancelling request:", error);
  }
};

  
       
  return (
    <div>
     <h2>My Requests</h2>
      {requests.length === 0 ? (
        <p>No Requests found.</p>
      ) : (
        <ul>
          {requests.map((booking, index) => (
            <li key={index}>
              <strong>Service:</strong> {booking.serviceType}<br />
              <strong>Location:</strong> {booking.location}<br />
              <strong>Status:</strong> {booking.status}<br />
              <strong>Booked At:</strong> {new Date(booking.bookedAt).toLocaleString()}<br />
              {booking.status === 'Pending' && (
                <button onClick={() => handleCancel(index)}>
                  Cancel Request
                </button>
              )}
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default MyRequests