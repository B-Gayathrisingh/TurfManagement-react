
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';
import TurfCard from '../components/TurfCard';


const TurfSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  price: Yup.number().required('Required').positive('Price must be positive'),
  description: Yup.string().required('Required'),
});

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [turfs, setTurfs] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTurf, setEditingTurf] = useState(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('turfs');

  useEffect(() => {
    loadTurfs();
    loadBookings();
  }, []);

  const loadTurfs = () => {
    turfService.getAll()
      .then(response => setTurfs(response.data))
      .catch(error => setError('Failed to load turfs'));
  };

  const loadBookings = () => {
    bookingService.getAll()
      .then(response => setBookings(response.data))
      .catch(error => setError('Failed to load bookings'));
  };

  const handleCreateTurf = (values, { setSubmitting, resetForm }) => {
    const turfData = {
      ...values,
      price: Number(values.price)
    };

    turfService.create(turfData)
      .then(() => {
        loadTurfs();
        setShowModal(false);
        resetForm();
        setError('');
      })
      .catch(error => setError('Failed to create turf'))
      .finally(() => setSubmitting(false));
  };

  const handleEditTurf = (turf) => {
    setEditingTurf(turf);
    navigate(`/edit-turf/${turf.id}`);
  };

  const handleDeleteTurf = (id) => {
    if (window.confirm('Are you sure you want to delete this turf?')) {
      turfService.delete(id)
        .then(() => {
          loadTurfs();
          setError('');
        })
        .catch(error => setError('Failed to delete turf'));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingTurf(null);
  };

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4">
        <Row>
          <Col>
            <h2>Admin Dashboard</h2>
            <Button variant="primary" onClick={() => setActiveTab('turfs')} className="me-2">
              Manage Turfs
            </Button>
            <Button variant="secondary" onClick={() => setActiveTab('bookings')}>
              View Bookings
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger" className="mt-3">{error}</Alert>}

        {activeTab === 'turfs' && (
          <>
            <Row className="mt-3">
              <Col>
                <Button variant="success" onClick={() => setShowModal(true)}>
                  Add New Turf
                </Button>
              </Col>
            </Row>

            <Row className="mt-3">
              {turfs.map(turf => (
                <Col md={4} key={turf.id}>
                  <TurfCard 
                    turf={turf} 
                    onEdit={handleEditTurf}
                    onDelete={handleDeleteTurf}
                    isAdmin={true}
                  />
                </Col>
              ))}
            </Row>

            <Modal show={showModal} onHide={handleCloseModal}>
              <Modal.Header closeButton>
                <Modal.Title>Add New Turf</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Formik
                  initialValues={{ title: '', location: '', price: '', description: '' }}
                  validationSchema={TurfSchema}
                  onSubmit={handleCreateTurf}
                >
                  {({ errors, touched, isSubmitting }) => (
                    <Form>
                      <div className="mb-3">
                        <label htmlFor="title" className="form-label">Title</label>
                        <Field 
                          type="text" 
                          name="title" 
                          className={`form-control ${errors.title && touched.title ? 'is-invalid' : ''}`}
                        />
                        {errors.title && touched.title && (
                          <div className="invalid-feedback">{errors.title}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="location" className="form-label">Location</label>
                        <Field 
                          type="text" 
                          name="location" 
                          className={`form-control ${errors.location && touched.location ? 'is-invalid' : ''}`}
                        />
                        {errors.location && touched.location && (
                          <div className="invalid-feedback">{errors.location}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="price" className="form-label">Price</label>
                        <Field 
                          type="number" 
                          name="price" 
                          className={`form-control ${errors.price && touched.price ? 'is-invalid' : ''}`}
                        />
                        {errors.price && touched.price && (
                          <div className="invalid-feedback">{errors.price}</div>
                        )}
                      </div>

                      <div className="mb-3">
                        <label htmlFor="description" className="form-label">Description</label>
                        <Field 
                          as="textarea" 
                          name="description" 
                          className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                        />
                        {errors.description && touched.description && (
                          <div className="invalid-feedback">{errors.description}</div>
                        )}
                      </div>

                      <Button type="submit" variant="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Create Turf'}
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Modal.Body>
            </Modal>
          </>
        )}

        {activeTab === 'bookings' && (
          <Row className="mt-3">
            <Col>
              <h3>Bookings</h3>
              {bookings.length === 0 ? (
                <p>No bookings found.</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>User</th>
                      <th>Turf</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(booking => (
                      <tr key={booking.id}>
                        <td>{booking.id}</td>
                        <td>{booking.userName}</td>
                        <td>{booking.turfTitle}</td>
                        <td>{new Date(booking.date).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </Col>
          </Row>
        )}
      </Container>
    </>
  );
};

export default AdminDashboard;
