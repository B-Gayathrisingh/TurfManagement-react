
import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';

const TurfCard = ({ turf, onEdit, onDelete, onAddToCart, isAdmin = false }) => {
  return (
    <Card style={{ width: '18rem', margin: '10px' }}>
      <Card.Body>
        <Card.Title>{turf.title}</Card.Title>
        <Card.Text>
          {turf.description}
          <br />
          <Badge bg="info">Location: {turf.location}</Badge>
          <br />
          <Badge bg="success">Price: ${turf.price}</Badge>
        </Card.Text>
        {isAdmin ? (
          <>
            <Button variant="primary" onClick={() => onEdit(turf)}>Edit</Button>{' '}
            <Button variant="danger" onClick={() => onDelete(turf.id)}>Delete</Button>
          </>
        ) : (
          <Button variant="primary" onClick={() => onAddToCart(turf)}>Add to Cart</Button>
        )}
      </Card.Body>
    </Card>
  );
};

export default TurfCard;
