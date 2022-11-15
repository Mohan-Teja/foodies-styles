import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';
import { useOutletContext ,useNavigate, Link } from "react-router-dom";
import axios from 'axios';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { LinkContainer } from 'react-router-bootstrap'
import Image from 'react-bootstrap/Image'
import Card from 'react-bootstrap/Card';
import Ratio from 'react-bootstrap/Ratio';
function Profile(props) {
  const [user, setUser] = useOutletContext();
  const [userDetail, setUserDetail] = useState({username:'',email:'',id:'',is_contributor:false});
  const [error, setError] = useState(null);
  const [listings, setListings] = useState([]);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();
  const loadprofile = () => {axios.get('/auth/users/me/', {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    }
    )
    .then(res => {
      //console.log(res);   
      setUserDetail(res.data);
      
    }).catch(function (err) {
      localStorage.clear();
      navigate('/login');
    });
    
    
    axios.get('/recipe/manage', {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    }
    )
    .then(res => {
      //console.log(res);   
      const html = res.data.listing.map((l) =>
      (
        <Col key={l.id}>
        <Card className="m-2" style={{ width: '18rem' }} >
        <Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.main_photo}  /></Ratio>
        <Card.Body>
        
          <LinkContainer to={'/view-recipe/'+l.slug}><Card.Link><Card.Title>{l.title}</Card.Title></Card.Link></LinkContainer>
          <Card.Subtitle className="mb-2 text-muted">{l.meal_type}</Card.Subtitle>
          <LinkContainer to={'/edit-recipe/'+l.slug}><Card.Link>Edit</Card.Link></LinkContainer>
          <Card.Link onClick={()=>deleteRecipe(l.slug)} href="#">Delete</Card.Link>
        </Card.Body>
      </Card>
      </Col>
      ));
      setListings(html);
    });
    
    axios.get('/recipe/get-liked-listings', {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    }
    )
    .then(res => {
      //console.log(res);   
      const html = res.data.listing.map((l) =>
      (
        <Col key={l.id}>
        <Card className="m-2" style={{ width: '18rem' }} >
        <Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.main_photo}  /></Ratio>
        <Card.Body>
        
          <LinkContainer to={'/view-recipe/'+l.slug}><Card.Link><Card.Title>{l.title}</Card.Title></Card.Link></LinkContainer>
          <Card.Subtitle className="mb-2 text-muted">{l.meal_type}</Card.Subtitle>
          <Card.Link onClick={()=>toggleLike(l.id)} href="#">Unlike</Card.Link>
        </Card.Body>
      </Card>
      </Col>
      ));
      setLiked(html);
    });
    
    };
    
  useEffect(() => {
    //console.log(user);
   
    if((!user || !user.access) && !localStorage.getItem('user') ){
      navigate('/login');
    } 
    if(user && user.access){
      loadprofile();
    }

  },[user]);

  const deleteRecipe = function(slug) {
    
    axios.delete('/recipe/manage', {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
      , data: {'slug':slug}
    });
    loadprofile();
  }
  
  const toggleLike = function(id){

    let obj = {};
    obj['listing_id'] = id;
    
    axios.post('/recipe/toggle-like',obj,{timeout: 10000,
    headers: {
      Authorization: 'JWT '+user.access
    }})
    .then(res => {
        loadprofile();
    }).catch(function (err) {
      
    });
    
  }
  const handleUpgrade = function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    if (!formData.get('profile_description') || (formData.get('profile_photo').size == 0)) {
      setError('All fields are required');
      return;
    }
    
    axios.patch('/auth/users/me/',formData,{
      headers: {
        Authorization: 'JWT '+user.access,
        'Content-Type': 'multipart/form-data'
      }
      , timeout: 15000
    })
    .then(res => {
      console.log(res);    
      setError("You are now a contributor");
      loadprofile();
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
  const handleUpdate = function(event) {
    event.preventDefault();

    const formData = new FormData(event.target);
    
    if (!formData.get('username')) {
      formData.delete('username');
    }
    
    if (!formData.get('profile_Description')) {
      formData.delete('profile_Description');
    }
    
    if (formData.get('profile_photo').size == 0) {
      formData.delete('profile_photo');
    }
    
    axios.patch('/auth/users/me/',formData,{
      headers: {
        Authorization: 'JWT '+user.access,
        'Content-Type': 'multipart/form-data'
      }
      , timeout: 15000
    })
    .then(res => {
      console.log(res);    
      setError("Profile updated");
      loadprofile();
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
          { error ? <Alert key='primary' variant='primary'>
          { error }
        </Alert> : '' }
    <Row>
    <Col sm={4}>
    <h3>Profile</h3>
    
    <p>Email: {userDetail.email}</p>
    {userDetail.is_contributor ? (<p>Display Name: {userDetail.username}</p>) : "" }
    {userDetail.is_contributor ? (<p>Profile description: {userDetail.profile_description}</p>) : "" }
    
    <p><strong>{userDetail.is_contributor ? "Contributor" : "Explorer"}</strong></p>
    
    
    
    <Image src={userDetail.profile_photo} fluid rounded style={{'maxWidth':'220px'}}/>

    <br />
    <Link className="link-primary" to="/request-reset-password">Change Password</Link>
    </Col>

    <Col>
  
        <Tabs
      defaultActiveKey="myrecipies"

      className="mb-3"
    >
      <Tab eventKey="myrecipies" title="My Recipies">
        {!userDetail.is_contributor && 
        <>
        <p>
          You are not a contributor. Complete your profile to become a contributor.</p>
          <Form onSubmit={handleUpgrade}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Display Name</Form.Label>
              <Form.Control name="username" type='text' />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Profile Description</Form.Label>
              <Form.Control name="profile_description" as="textarea" rows={3} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control type="file" name="profile_photo" />
            </Form.Group>
              <Form.Control type="hidden" name="is_contributor" value="true" />
            <Button variant="primary" type="submit">
            Update
          </Button>
          </Form></> }
          {userDetail.is_contributor && 

          <LinkContainer to="/create-recipe">
          <Button variant="secondary" type="button">
            Create New Recipe
          </Button>
        </LinkContainer> }
        <div className="container text-center">
          <div className="row row-cols-md-1 row-cols-lg-2">
            { listings }
          </div>
        </div>
      </Tab>
      <Tab eventKey="likedrecipies" title="Liked Recipies">
        <div className="container text-center">
          <div className="row row-cols-md-1 row-cols-lg-2">
            { liked }
          </div>
        </div>
      </Tab>
      
      {userDetail.is_contributor && 
      <Tab eventKey="updateprofile" title="Update Profile">
          <Form onSubmit={handleUpdate}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Label>Display Name</Form.Label>
              <Form.Control name="username" type='text' defaultValue={userDetail.username} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="description">
              <Form.Label>Profile Description</Form.Label>
              <Form.Control name="profile_description" as="textarea" rows={3} defaultValue={userDetail.profile_description} />
            </Form.Group>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Profile Photo</Form.Label>
              <Form.Control type="file" name="profile_photo" />
            </Form.Group>
              <Form.Control type="hidden" name="is_contributor" value="true" />
            <Button variant="primary" type="submit">
            Update
          </Button>
          </Form>
      </Tab>}
    </Tabs>
    </Col>
    </Row>
    </Container>
  );
}

export default Profile;