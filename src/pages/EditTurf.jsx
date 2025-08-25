
import React, { useState, useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import AdminNavbar from '../components/AdminNavbar';


const TurfSchema = Yup.object().shape({
  title: Yup.string().required('Required'),
  location: Yup.string().required('Required'),
  price: Yup.number().required('Required').positive('Price must be positive'),
  description: Yup.string().required('Required'),
});

const EditTurf = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [turf, setTurf] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTurf();
  }, [id]);

  const loadTurf = () => {
    turfService.getById(id)
      .then(response => setTurf(response.data))
      .catch(error => setError('Failed to load turf'));
  };

  const handleSubmit = (values, { setSubmitting }) => {
    const turfData = {
      ...values,
      price: Number(values.price)
    };

    turfService.update(id, turfData)
      .then(() => {
        navigate('/admin');
        setError('');
      })
      .catch(error => setError('Failed to update turf'))
      .finally(() => setSubmitting(false));
  };

  if (!turf) {
    return (
      <>
        <AdminNavbar />
        <Container className="mt-4">
          <Row>
            <Col>
              <p>Loading...</p>
            </Col>
          </Row>
        </Container>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <Card>
              <Card.Header as="h3">Edit Turf</Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                <Formik
                  initialValues={{
                    title: turf.title,
                    location: turf.location,
                    price: turf.price,
                    description: turf.description
                  }}
                  validationSchema={TurfSchema}
                  onSubmit={handleSubmit}
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

                      <Button type="submit" variant="primary" disabled={isSubmitting} className="me-2">
                        {isSubmitting ? 'Updating...' : 'Update Turf'}
                      </Button>
                      <Button variant="secondary" onClick={() => navigate('/admin')}>
                        Cancel
                      </Button>
                    </Form>
                  )}
                </Formik>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default EditTurf;
