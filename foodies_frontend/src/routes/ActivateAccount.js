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
  let urlparams = useParams();
     
  useEffect(() => {
  
    console.log(urlparams);   
    axios.post('/auth/users/activation/',urlparams,{timeout: 10000})
    .then(res => {
      console.log(res);   
      
      setError("Account activated, login below.");
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
  }, [urlparams]);
  
  return (
    <>
      <Container>
        { error ? <Alert key='primary' variant='primary'>
            { error }
          </Alert> : '' }
      
      </Container>
      <Login />
    </>
  );
}



export default ActivateAccount;