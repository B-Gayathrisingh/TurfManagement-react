import React from 'react';
import { Navbar, Nav, Container, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';


const UserNavbar = () => {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    cartService.getCart().then(response => {
      setCartItems(response.data);
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <Navbar bg="primary" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand>Turf User</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link onClick={() => navigate('/user')}>Browse Turfs</Nav.Link>
            <Nav.Link onClick={() => navigate('/cart')}>
              Cart <Badge bg="secondary">{cartItems.length}</Badge>
            </Nav.Link>
            <Nav.Link onClick={() => navigate('/checkout')}>Checkout</Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;