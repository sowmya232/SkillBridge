import { useEffect, useState } from 'react';
import { collection, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/Config';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import './ViewProfiles.css'

let loggedInUser = JSON.parse(localStorage.getItem('loggedInCustomer'));

const ViewProfiles = () => {
  const [workers, setWorkers] = useState([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [location, setLocation] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  /////////////////////////////////////////////////////////////

  const [allWorkers, setAllWorkers] = useState([]);

  ///////////////////////////////////////////////////////////////////////////////////////////////

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [filteredData, setFilteredData] = useState([]);



  /////////////////////////////////////////////////////////////////////////////////////////

  ////////////////////////////////////////////////////////////////////////////////////////

const [selectedTrade, setSelectedTrade] = useState('');
const [selectedAvailability, setSelectedAvailability] = useState('');
const [selectedArea, setSelectedArea] = useState('');
const [minRate, setMinRate] = useState('');
const [maxRate, setMaxRate] = useState('');
const [selectedRating, setSelectedRating] = useState('');


  //////////////////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'workers'));
        const data = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setWorkers(data);
        setAllWorkers(data);
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
        selectedDate,
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


  const applyFilters = () => {
  const filtered = allWorkers.filter(worker => {
    if (!Array.isArray(worker.services)) return false;

    return worker.services.some(service => {
      const matchesTrade = selectedTrade ? service.typeOfTrade === selectedTrade : true;
      const matchesAvailability = selectedAvailability ? service.availability === selectedAvailability : true;
      const matchesArea = selectedArea ? service.workArea === selectedArea : true;
      const rate = Number(service.consultation);
      const matchesMinRate = minRate ? rate >= Number(minRate) : true;
      const matchesMaxRate = maxRate ? rate <= Number(maxRate) : true;
      const matchesRating = selectedRating ? Number(service.rating || 0) >= Number(selectedRating) : true;

      return (
        matchesTrade &&
        matchesAvailability &&
        matchesArea &&
        matchesMinRate &&
        matchesMaxRate &&
        matchesRating
      );
    });
  });

  setWorkers(filtered);
  setShowFilterModal(false);
};


const resetFilters = () => {
  setSelectedTrade('');
  setSelectedAvailability('');
  setSelectedArea('');
  setMinRate('');
  setMaxRate('');
  setSelectedRating('');
  setWorkers(allWorkers); // Show all profiles again
  setShowFilterModal(false); // Close the modal
};





  return (
    <div className="container mt-4">
      <div id='top_filter'>
        <h2 className="mb-4">Available Workers</h2>
        <Button variant="outline-primary" className="mb-3" onClick={() => setShowFilterModal(true)} >  🔍 Filter Profiles  </Button>
      </div>
    
      {/* <Card className="mb-4 p-3 shadow-sm">
 
      </Card>  */}



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

          <Form.Group controlId="date">
            <Form.Label>Select a date:</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
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



      {/* ------------------------------------------------------------------------------------------------- */}

  

  <Modal show={showFilterModal} onHide={() => setShowFilterModal(false)} centered size="lg">
    <Modal.Header closeButton>
      <Modal.Title>Filter Workers</Modal.Title>
    </Modal.Header>
    <Modal.Body>
    <Card className="mb-4 p-3 shadow-sm">
        <Row className="g-3">
          <Col md={4}>
            <Form.Group>
              <Form.Label>Type of Trade</Form.Label>
              <Form.Select value={selectedTrade} onChange={(e) => setSelectedTrade(e.target.value)}>
                <option value="">All</option>
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
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Availability</Form.Label>
              <Form.Select value={selectedAvailability} onChange={(e) => setSelectedAvailability(e.target.value)}>
                <option value="">All</option>
                <option value="Immediate">Immediate</option>
                <option value="Within 24h">Within 24h</option>
                <option value="Scheduled">Scheduled</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Work Area</Form.Label>
              <Form.Select value={selectedArea} onChange={(e) => setSelectedArea(e.target.value)}>
                <option value="">All</option>
                <option value="Hyderabad">Hyderabad</option>
                <option value="Bangalore">Bangalore</option>
              </Form.Select>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Consultation Rate</Form.Label>
              <div className="d-flex gap-2">
                <Form.Control
                  type="number"
                  placeholder="Min"
                  value={minRate}
                  onChange={(e) => setMinRate(e.target.value)}
                />
                <Form.Control
                  type="number"
                  placeholder="Max"
                  value={maxRate}
                  onChange={(e) => setMaxRate(e.target.value)}
                />
              </div>
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label>Rating</Form.Label>
              <Form.Select value={selectedRating} onChange={(e) => setSelectedRating(e.target.value)}>
                <option value="">All</option>
                <option value="4">4 ⭐ and above</option>
                <option value="3">3 ⭐ and above</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
      </Card>

    </Modal.Body>
    <Modal.Footer>
      <Button variant="warning" onClick={resetFilters}>
        Reset Filters
      </Button>

     <Button variant="primary" onClick={applyFilters}>
        Apply Filters
      </Button>
    </Modal.Footer>
  </Modal>











































    </div>
  );
};

export default ViewProfiles;
