import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/Config';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';

let loggedInUser = JSON.parse(localStorage.getItem('loggedInCustomer'));

const ViewProfiles = () => {
  const [workers, setWorkers] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'workers'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWorkers(data);
      } catch (error) {
        console.error('Error fetching workers:', error);
      }
    };
    fetchData();
  }, []);

  const handleDetailsModal = (worker, service) => {
    setSelectedWorker(worker);
    setSelectedService(service);
    setShowDetailsModal(true);
  };

  const handleBookingModal = () => {
    setShowBookingModal(true);
    setShowDetailsModal(false);
  };

  const handleConfirmBooking = async () => {
    if (!location || !loggedInUser || !selectedWorker || !selectedService) return;

    try {
      const customerRef = doc(db, 'customers', loggedInUser.uid);
      const bookingData = {
        workerId: selectedWorker.uid,
        serviceType: selectedService.typeOfTrade,
        location,
        status: 'Pending',
        bookedAt: new Date().toISOString()
      };

      // Store the booking under the customer
      await updateDoc(customerRef, {
        bookings: arrayUnion(bookingData)
      });

      // Optionally, also store this booking in worker's document
      const workerRef = doc(db, 'workers', selectedWorker.uid);
      await updateDoc(workerRef, {
        bookings: arrayUnion({
          customerId: loggedInUser.uid,
          serviceType: selectedService.typeOfTrade,
          location,
          status: 'Pending',
          bookedAt: new Date().toISOString()
        })
      });

      alert('Booking confirmed!');
      setShowBookingModal(false);
      setSelectedWorker(null);
      setSelectedService(null);
      setLocation('');
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Workers</h2>
      <Row xs={1} md={2} className="g-4">
        {workers.map(worker =>
          Array.isArray(worker.services) ? (
            worker.services.map((service, index) => (
              <Col key={`${worker.id}-${index}`}>
                <Card className="h-100">
                  <Card.Img
                    variant="top"
                    src={service.image || "https://via.placeholder.com/300"}
                    alt={service.typeOfTrade || "Service Image"}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <Card.Body>
                    <Card.Title>{worker.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {service.typeOfTrade}
                    </Card.Subtitle>
                    <Button variant="primary" onClick={() => handleDetailsModal(worker, service)}>
                      View More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : null
        )}
      </Row>

      {/* Worker Details Modal */}
      <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedWorker?.name}'s Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedWorker && selectedService && (
            <>
              <strong>Description:</strong> {selectedService.serviceDescription} <br />
              <strong>Consultation:</strong> ₹{selectedService.consultation} <br />
              <strong>Location:</strong> {selectedService.workArea} <br />
              <strong>Availability:</strong> {selectedService.availability} <br />
              <strong>Rating:</strong> {selectedService.rating || 'Not Rated'}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleBookingModal}>Book Now</Button>
        </Modal.Footer>
      </Modal>

      {/* Booking Modal */}
      <Modal show={showBookingModal} onHide={() => setShowBookingModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Booking</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="location">
            <Form.Label>Enter your location:</Form.Label>
            <Form.Control
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g., Banjara Hills, Hyderabad"
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={handleConfirmBooking}>
            Confirm Booking
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ViewProfiles;
