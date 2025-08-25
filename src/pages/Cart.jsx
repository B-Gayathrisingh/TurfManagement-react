import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Table, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import UserNavbar from '../components/UserNavbar';


const Cart = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState('');

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

  const handleUpdateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    cartService.updateCartItem(id, { quantity: newQuantity })
      .then(() => loadCart())
      .catch(error => setError('Failed to update quantity'));
  };

  const handleRemoveItem = (id) => {
    cartService.removeFromCart(id)
      .then(() => loadCart())
      .catch(error => setError('Failed to remove item'));
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
            <h2>Shopping Cart</h2>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

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
              <Col>
                <Table striped bordered hover>
                  <thead>
                    <tr>
                      <th>Turf</th>
                      <th>Price</th>
                      <th>Quantity</th>
                      <th>Total</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>${item.price}</td>
                        <td>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="mx-2">{item.quantity}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                          >
                            +
                          </Button>
                        </td>
                        <td>${item.price * item.quantity}</td>
                        <td>
                          <Button 
                            variant="danger" 
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            Remove
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Col>
            </Row>

            <Row>
              <Col className="text-end">
                <h4>Total: ${getTotalPrice()}</h4>
                <Button variant="success" onClick={() => navigate('/checkout')}>
                  Proceed to Checkout
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </>
  );
};

export default Cart;