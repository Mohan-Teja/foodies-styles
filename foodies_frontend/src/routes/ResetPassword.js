import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useOutletContext } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap'
import Login from "./Login";

import { useParams } from "react-router-dom";


function ActivateAccount(props) {
  const [error, setError] = useState(null);
  const [user, setUser] = useOutletContext();
  const [success, setSuccess] = useState(false);
  let urlparams = useParams();
     
  const handleSubmit = function(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    
    let object = {};
    formData.forEach((value, key) => object[key] = value);

    axios.post('/auth/users/reset_password_confirm/',{...urlparams,...object},{timeout: 10000})
    .then(res => {
      console.log(res);   
      
      setError("Password reset, login below.");
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
    <>
      <Container>
        { error ? <Alert key='primary' variant='primary'>
            { error }
          </Alert> : '' }
          {!success && (<>
          <Form className="mb-3" onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="new_password">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="new_password" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="re_new_password">
              <Form.Label>Re-enter Password</Form.Label>
              <Form.Control type="password" placeholder="Password" name="re_new_password" />
            </Form.Group>
          
          
          <Button variant="primary" type="submit">
            Reset Password
          </Button>
          </Form>
            
            
    
          <p>Already have an account?</p>
          <LinkContainer to="/login">
            <Button variant="secondary" type="button">
              Login
            </Button>
          </LinkContainer></>)}
      </Container>
      {success && (<Login />)}
    </>
  );
}



export default ActivateAccount;