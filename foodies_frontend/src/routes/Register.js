import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useOutletContext } from "react-router-dom";
import axios from 'axios';
import { useState } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
function Register(props) {
  const [user, setUser] = useOutletContext();
  const [error, setError] = useState(null);
  
  const [success, setSuccess] = useState(false);
  
  const handleSubmit = function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);

    let object = {};
    // take form data and turn into json object. the 'name' in the form input should match the API
    formData.forEach((value, key) => object[key] = value);
    // the API needs some extra value
    object['is_contributor'] = false;
  
    axios.post('/auth/users/',object,{timeout: 10000})
    .then(res => {
      //console.log(res);    
      setSuccess(true);
      setError(null);
    }).catch(function (err) {
      //console.log(err);
      let errorMessage = '';
      const responseData = err.response.data;
      const k = Object.keys(responseData)[0];
      const v = responseData[k];
      
      if(Array.isArray(v)) {
        errorMessage = k + ': ' + v[0];
      } else {
        errorMessage = k + ': ' + v;
      }
      
      setError(errorMessage);
    });
    
    
  }
  return (
    <Container>
      <h3>Register</h3>
      { error ? <Alert key='primary' variant='primary'>
          { error }
        </Alert> : '' }
        {!success && (<>
      <Form className="mb-3" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" />
            <Form.Text className="text-muted">
          </Form.Text>
        </Form.Group>
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="re_password">
          <Form.Label>Re-enter Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="re_password" />
        </Form.Group>
      
      
      <Button variant="primary" type="submit">
        Register
      </Button>
      </Form>
        
        

      <p>Already have an account?</p>
      <LinkContainer to="/login">
        <Button variant="secondary" type="button">
          Login
        </Button>
      </LinkContainer></>)}
      {success && (
          <p>Registration successful, please check your email and click on the validation link</p>
        )}   
    </Container>
    
    
  );
}



export default Register;