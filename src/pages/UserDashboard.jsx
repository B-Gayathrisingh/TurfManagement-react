import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Alert } from 'react-bootstrap';
import UserNavbar from '../components/UserNavbar';
import TurfCard from '../components/TurfCard';


const UserDashboard = () => {
  const [turfs, setTurfs] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTurfs();
  }, []);

  const loadTurfs = () => {
    turfService.getAll()
      .then(response => setTurfs(response.data))
      .catch(error => setError('Failed to load turfs'));
  };

  const handleAddToCart = (turf) => {
    const cartItem = {
      turfId: turf.id,
      title: turf.title,
      price: turf.price,
      quantity: 1,
      userId: JSON.parse(localStorage.getItem('user')).id
    };

    cartService.addToCart(cartItem)
      .then(() => {
        alert('Added to cart successfully!');
        setError('');
      })
      .catch(error => setError('Failed to add to cart'));
  };

  return (
    <>
      <UserNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Browse Turfs</h2>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        <Row className="mt-3">
          {turfs.map(turf => (
            <Col md={4} key={turf.id}>
              <TurfCard 
                turf={turf} 
                onAddToCart={handleAddToCart}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </>
  );
};

export default UserDashboard;