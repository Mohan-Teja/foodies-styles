import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useOutletContext,useNavigate } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
function RequestResetPassword(props) {
  const [user, setUser] = useOutletContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const navigate = useNavigate();
  
  const handleSubmit = function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    
    let object = {};
    formData.forEach((value, key) => object[key] = value);

    axios.post('/auth/users/reset_password/',object,{timeout: 10000})
    .then(res => {
      //console.log(res);    
      setUser(res.data);
      setSuccess(true);
    }).catch(function (err) {
      console.log(err);
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
      <h3>Reset Password</h3>
      { error ? <Alert key='primary' variant='primary'>
          { error }
        </Alert> : '' }
        
        {!success && (<>
      <Form className="mb-3" onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="email">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" name="email" />
        </Form.Group>
      
      
      <Button variant="primary" type="submit" >
        Reset Password Request
      </Button>
      </Form>
      
      <p>Know you password?</p>
      <LinkContainer to="/login">
        <Button variant="secondary" type="button">
          Login
        </Button>
      </LinkContainer></>)}
          {success && (
              <p>Request received, please check your email and click on the reset password link</p>
            )}  
    </Container>
  );
}



export default RequestResetPassword;