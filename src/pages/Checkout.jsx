import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';


const Checkout = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const userId = JSON.parse(localStorage.getItem('user')).id;
    
    cartService.getCart()
      .then(response => {
        const userCart = response.data.filter(item => item.userId === userId);
        setCartItems(userCart);
      })
      .catch(error => setError('Failed to load cart'));
  };

  const handleCheckout = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    const bookingDate = new Date().toISOString();
    
    // Create a booking for each cart item
    const bookingPromises = cartItems.map(item => {
      const booking = {
        userId: user.id,
        userName: user.name,
        turfId: item.turfId,
        turfTitle: item.title,
        date: bookingDate,
        total: item.price * item.quantity
      };
      
      return bookingService.create(booking);
    });
    
    Promise.all(bookingPromises)
      .then(() => {
        // Clear the cart
        return cartService.clearCart();
      })
      .then(() => {
        setSuccess('Checkout successful!');
        setTimeout(() => navigate('/user'), 2000);
      })
      .catch(error => setError('Checkout failed. Please try again.'));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <>
      <UserNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Checkout</h2>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        {cartItems.length === 0 ? (
          <Row className="mt-3">
            <Col>
              <p>Your cart is empty.</p>
              <Button variant="primary" onClick={() => navigate('/user')}>
                Browse Turfs
              </Button>
            </Col>
          </Row>
        ) : (
          <>
            <Row className="mt-3">
              <Col md={8}>
                <Card>
                  <Card.Header>
                    <h4>Order Summary</h4>
                  </Card.Header>
                  <Card.Body>
                    {cartItems.map(item => (
                      <div key={item.id} className="d-flex justify-content-between mb-2">
                        <div>
                          {item.title} x {item.quantity}
                        </div>
                        <div>${item.price * item.quantity}</div>
                      </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between">
                      <strong>Total:</strong>
                      <strong>${getTotalPrice()}</strong>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            <Row className="mt-3">
              <Col>
                <Button variant="success" onClick={handleCheckout}>
                  Confirm Checkout
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Checkout;