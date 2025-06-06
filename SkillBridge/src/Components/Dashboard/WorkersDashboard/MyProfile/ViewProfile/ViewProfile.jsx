import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../../ConfigFirebase/Config';

function ViewProfile() {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState(null);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const loggedInUser =
    JSON.parse(localStorage.getItem('loggedInWorker')) ||
    JSON.parse(localStorage.getItem('loggedInCustomer'));

  useEffect(() => {
    const fetchUserData = async () => {
      if (!loggedInUser) return;
      const userRef = doc(db, `${loggedInUser.role}s`, `${loggedInUser.uid}`);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        setUserData(docSnap.data());
      } else {
        console.log("User not found");
      }
    };

    fetchUserData();
  }, [loggedInUser]);

  return (
    <div>
      <Button variant="primary" onClick={handleShow} style={{ margin: '20px' }}>
        View Profile
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{`Welcome ${loggedInUser?.name}`}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        {userData ? (
            <div>
            {userData.services && userData.services.length > 0 && (
               <>
                <h5 className="mt-3">Services Offered:</h5>
                {userData.services.map((service, index) => (
                    <div key={index} style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '10px', marginBottom: '10px' }}>
                    <div style={{ textAlign: 'center' }}>
                    <img
                    src={service.image}
                    alt="Profile"
                    style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                   </div>
                    <p><strong>Name:</strong> {userData.name}</p>
                    <p><strong>Email:</strong> {userData.email}</p>
                    <p><strong>Role:</strong> {userData.role}</p>
                    <p><strong>Type of Trade:</strong> {service.typeOfTrade}</p>
                    <p><strong>Service Description:</strong> {service.serviceDescription}</p>
                    <p><strong>Rating:</strong> {service.rating}</p>
                    <p><strong>Experience:</strong> {service. experience} years</p>
                    <p><strong>Availability:</strong> {service.availability}</p>
                    <p><strong>Consultation:</strong> ₹ {service.consultation}</p>
                    <p><strong>Work Area:</strong> {service.workArea}</p>
                    </div>
                ))}
                </>
            )}
            </div>
        ) : (
            <div>
                    <p>Loading............</p>
            </div>
        )}
        </Modal.Body>


      </Modal>
    </div>
  );
}

export default ViewProfile;
