import React from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';


const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = React.useState('');

  const handleSubmit = (values, { setSubmitting }) => {
    setError('');
    authService.login(values.email, values.password)
      .then(response => {
        if (response.data.length > 0) {
          const user = response.data[0];
          localStorage.setItem('user', JSON.stringify(user));
          
          if (user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        } else {
          setError('Invalid email or password');
        }
        setSubmitting(false);
      })
      .catch(error => {
        setError('Login failed. Please try again.');
        setSubmitting(false);
      });
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card>
            <Card.Header as="h3">Login</Card.Header>
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Formik
                initialValues={{ email: '', password: '' }}
                validationSchema={LoginSchema}
                onSubmit={handleSubmit}
              >
                {({ errors, touched, isSubmitting }) => (
                  <Form>
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
                      {isSubmitting ? 'Logging in...' : 'Login'}
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

export default Login;