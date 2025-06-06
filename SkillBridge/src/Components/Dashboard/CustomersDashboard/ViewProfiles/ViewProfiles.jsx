import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../../ConfigFirebase/Config'; // Adjust this path
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const ViewProfiles = () => {
  const [workers, setWorkers] = useState([]);

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
                    <Card.Text>
                      <strong>Email:</strong> {worker.email} <br />
                      <strong>Location:</strong> {service.workArea} <br />
                      <strong>Consultation:</strong> ₹{service.consultation} <br />
                      <strong>Availability:</strong> {service.availability} <br />
                      <strong>Description:</strong> {service.serviceDescription} <br />
                      <strong>Rating:</strong> {service.rating || 'Not Rated'}
                    </Card.Text>
                    <Button variant="primary">Book Now</Button>
                  </Card.Body>
                </Card>
              </Col>
            ))
          ) : null
        )}
      </Row>
    </div>
  );
};

export default ViewProfiles;
