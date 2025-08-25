import React from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="text-center">
            <Card.Header as="h1">Welcome to Turf Management System</Card.Header>
            <Card.Body>
              <Card.Text>
                Manage and book turfs with our easy-to-use system
              </Card.Text>
              <Button variant="primary" className="me-3" onClick={() => navigate('/login')}>
                Login
              </Button>
              <Button variant="secondary" onClick={() => navigate('/register')}>
                Register
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Welcome;