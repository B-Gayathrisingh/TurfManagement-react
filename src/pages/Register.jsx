
import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const RegisterSchema = Yup.object().shape({
  name: Yup.string().required('Required'),
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Required'),
});

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');
  const [success, setSuccess] = React.useState('');

  const handleSubmit = (values, { setSubmitting }) => {
    setError('');
    setSuccess('');
    
    // Check if email already exists
    authService.login(values.email, values.password)
      .then(response => {
        if (response.data.length > 0) {
          setError('Email already exists');
          setSubmitting(false);
        } else {
          // Register new user
          const newUser = {
            name: values.name,
            email: values.email,
            password: values.password,
            role: 'user'
          };
          
          authService.register(newUser)
            .then(() => {
              setSuccess('Registration successful. Please login.');
              setTimeout(() => navigate('/login'), 2000);
              setSubmitting(false);
            })
            .catch(error => {
              setError('Registration failed. Please try again.');
              setSubmitting(false);
            });
        }
      })
      .catch(error => {
        setError('Registration failed. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h3">Register</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {success && <Alert variant="success">{success}</Alert>}
              <Formik
                initialValues={{ name: '', email: '', password: '' }}
                validationSchema={RegisterSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
                    <div className="mb-3">
                      <label htmlFor="name" className="form-label">Name</label>
                      <Field 
                        type="text" 
                        name="name" 
                        className={`form-control ${errors.name && touched.name ? 'is-invalid' : ''}`}
                      />
                      {errors.name && touched.name && (
                        <div className="invalid-feedback">{errors.name}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="email" className="form-label">Email</label>
                      <Field 
                        type="email" 
                        name="email" 
                        className={`form-control ${errors.email && touched.email ? 'is-invalid' : ''}`}
                      />
                      {errors.email && touched.email && (
                        <div className="invalid-feedback">{errors.email}</div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">Password</label>
                      <Field 
                        type="password" 
                        name="password" 
                        className={`form-control ${errors.password && touched.password ? 'is-invalid' : ''}`}
                      />
                      {errors.password && touched.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>

                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Registering...' : 'Register'}
                    </Button>
                  </Form>
                )}
              </Formik>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
