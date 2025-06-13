import React from 'react'
import { useEffect, useState } from 'react';
import { collection, getDoc, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/Config';
import Button from 'react-bootstrap/Button';

let loggedInUser = JSON.parse(localStorage.getItem('loggedInWorker'));

const NewJobRequest = () => {

   const [requests, setRequests] = useState([]);

  useEffect(()=>{
    const fetchRequest = async() =>{
        const userRef = doc(db, "workers", `${loggedInUser.uid}`)
        const userSnap = await getDoc(userRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            setRequests(userData.bookings || []);
          }
    
    ///////////////
 
  //   const handleCancel = async (index) => {
  //   const updatedRequests = [...requests];
  //   updatedRequests[index].status = 'Cancelled';

  //   // Update Firestore
  //   const userRef = doc(db, 'customers', loggedInUser.uid);
  //   await updateDoc(userRef, {
  //     bookings: updatedRequests
  //   });

  //   // Update UI
  //   setRequests(updatedRequests);
  // };
    
    }
    fetchRequest()
  }, [])

 const handleAccept = async (index) => {
  try {
    const workerRef = doc(db, "workers", loggedInUser.uid);
    const workerSnap = await getDoc(workerRef);

    if (workerSnap.exists()) {
      const workerData = workerSnap.data();
      const updatedWorkerBookings = [...workerData.bookings];

      // Update status in worker document
      const bookingToAccept = updatedWorkerBookings[index];
      bookingToAccept.status = "Accepted";

      await updateDoc(workerRef, {
        bookings: updatedWorkerBookings,
      });

      // Now update corresponding customer's booking
      const customerId = bookingToAccept.customerId;
      const customerRef = doc(db, "customers", customerId);
      const customerSnap = await getDoc(customerRef);

      if (customerSnap.exists()) {
        const customerData = customerSnap.data();
        const updatedCustomerBookings = [...customerData.bookings];

        updatedCustomerBookings.forEach((booking) => {
          if (booking.workerId === loggedInUser.uid) {
            booking.status = "Accepted";
          }
        });

        await updateDoc(customerRef, {
          bookings: updatedCustomerBookings,
        });
      }

      // Optional: update local UI
      setRequests((prev) => {
        const updated = [...prev];
        updated[index].status = "Accepted";
        return updated;
      });

      alert(`Accepted request #${index + 1}`);
    }
  } catch (error) {
    console.error("Error accepting request:", error);
  }
};


const handleCancel = async (index) => {
  try {
    const workerRef = doc(db, "workers", loggedInUser.uid);
    const workerSnap = await getDoc(workerRef);

    if (workerSnap.exists()) {
      const workerData = workerSnap.data();
      const updatedWorkerBookings = [...workerData.bookings];

      const bookingToCancel = updatedWorkerBookings[index];
      bookingToCancel.status = "Rejected";

      // Update worker's bookings
      await updateDoc(workerRef, {
        bookings: updatedWorkerBookings,
      });

      // Get customerId from the booking
      const customerId = bookingToCancel.customerId;
      const customerRef = doc(db, "customers", customerId);
      const customerSnap = await getDoc(customerRef);

      if (customerSnap.exists()) {
        const customerData = customerSnap.data();
        const updatedCustomerBookings = [...customerData.bookings];

        // Update the status in the customer's bookings
        updatedCustomerBookings.forEach((booking) => {
          if (booking.workerId === loggedInUser.uid) {
            booking.status = "Rejected";
          }
        });

        // Update customer Firestore doc
        await updateDoc(customerRef, {
          bookings: updatedCustomerBookings,
        });
      }

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
              <div className="d-flex gap-2">
                <Button variant="success" onClick={() => handleAccept(index)}>
                  Accept Request
                </Button>

                <Button variant="danger" onClick={() => handleCancel(index)}>
                  Cancel Request
                </Button>
              </div>
            )}
              
              <hr />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default NewJobRequest