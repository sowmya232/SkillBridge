import React from 'react'
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { useState } from "react"
import { doc, updateDoc, arrayUnion, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../../ConfigFirebase/Config'

const Uploadservice = () => {
  const [show, setShow] = useState(false); // Start with modal closed
  const [details, setDetails] = useState({
    typeOfTrade: '',
    serviceDescription: '',
    rating:'',
    consultation: '',
    availability: '',
    workArea: '',
    image: ''
  })

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loggedInUser = 
      JSON.parse(localStorage.getItem('loggedInWorker')) || 
      JSON.parse(localStorage.getItem('loggedInCustomer'));
    
    if (!loggedInUser) {
      alert('User not logged in');
      return;
    }

    const userRef = doc(db, `${loggedInUser.role}s`, `${loggedInUser.uid}`);
    const docSnap = await getDoc(userRef);

    if (docSnap.exists()) {
      const existingData = docSnap.data();
      const oldServices = existingData.services || [];

      const updatedServices = [...oldServices, details];

      await updateDoc(userRef, {
        services: updatedServices
      });
    }

    alert('Services Added Successfully');
    handleClose();
    // Reset form after submission
    setDetails({
      typeOfTrade: '',
      serviceDescription: '',
      rating:'',
      experience:'',
      Consultation: '',
      availability: '',
      workArea: '',
      image: ''
    });
  }

  return (
    <div>
      {/* Button to open the modal */}
      <Button variant="primary" onClick={handleShow} style={{ margin: '20px' }}>
        Upload Service
      </Button>

      {/* Modal */}
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Service Registration</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
             
              <Form.Group className="mb-3" controlId="typeOfTrade">
                <Form.Label>Type of Trade</Form.Label>
                <Form.Select 
                  aria-label="Type of trade"
                  name="typeOfTrade"
                  value={details.typeOfTrade}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select a trade</option>
                  <option value="AC & Appliance Repair">AC & Appliance Repair</option>
                  <option value="Cleaning Pest Control">Cleaning Pest Control</option>
                  <option value="Electrician">Electrician</option>
                  <option value="Plumber">Plumber</option>
                  <option value="Carpenter">Carpenter</option>
                  <option value="Painting & Waterproofing">Painting & Waterproofing</option>
                  <option value="Wall Panels">Wall Panels</option>
                  <option value="Native Water Purifiers">Native Water Purifiers</option>
                  <option value="Native Smart Locks">Native Smart Locks</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="serviceDescription">
                <Form.Label>Service Description*</Form.Label>
                <Form.Control
                  as="textarea"
                  name="serviceDescription"
                  rows={5}
                  value={details.serviceDescription}
                  onChange={handleChange}
                  placeholder="Describe your services"
                  required
                />
              </Form.Group>

                <Form.Group className="mb-3" controlId="rating">
                <Form.Label>Rating</Form.Label>
                <Form.Control
                  type="number"
                  name="rating"
                  min="1"
                  value={details.rating   }
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="consultation">
                <Form.Label>Consultation ₹</Form.Label>
                <Form.Control
                  type="number"
                  name="consultation"
                  min="1"
                  value={details.hourlyRate}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

                <Form.Group className="mb-3" controlId="experience">
                <Form.Label>Experience</Form.Label>
                <Form.Control
                  type="number"
                  name="experience"
                  min="1"
                  value={details.experience}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              
              <Form.Group className="mb-3" controlId="availability">
                <Form.Label>Availability</Form.Label>
                <Form.Select 
                  aria-label="Availability"
                  name="availability"
                  value={details.availability}
                  onChange={handleChange}
                >
                  <option value="">Select availability</option>
                  <option value="Immediate">Immediate</option>
                  <option value="Within 24h">Within 24h</option>
                  <option value="Scheduled">Scheduled</option>
                </Form.Select>
              </Form.Group>

              <Form.Group className="mb-3" controlId="workArea">
                <Form.Label>Work Area (City/Locality)*</Form.Label>
                <Form.Control
                  type="text"
                  name="workArea"
                  placeholder="Enter onlu one location"
                  value={details.workArea}
                  onChange={handleChange}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3" controlId="image">
                <Form.Label>Image URL</Form.Label>
                <Form.Control 
                  type="url" 
                  name="image"
                  placeholder="https://example.com" 
                  value={details.image}
                  onChange={handleChange}
                />
                <Form.Text className="text-muted">
                  Enter URL of your service image
                </Form.Text>
              </Form.Group>

              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Register service
                </Button>
              </Modal.Footer>
            
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  )
}

export default Uploadservice;