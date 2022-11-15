import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import { useOutletContext, useNavigate } from "react-router-dom";
import axios from 'axios';
import { useState, useEffect } from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import React from 'react'
import CreatableSelect from 'react-select/creatable';
import { useParams } from "react-router-dom";
import ingredientReference from '../static/IngredientReference';
import Table from 'react-bootstrap/Table';
function EditRecipe(props) {
  const [error, setError] = useState(null);
  const [currentIngredient, setCurrentIngredient] = useState('');
  const [currentQty, setCurrentQty] = useState('');
  const [addedIngredients, setAddedIngredients] = useState([]);

  const [user, setUser] = useOutletContext();
  const [value, setValue] = useState('');
  const navigate = useNavigate();
  
  const [title, setTitle] = useState(null);
  const [description, setDescription] = useState(null);
  const [mealType, setMealType] = useState(null);
  const [id, setId] = useState(null);
  let { slug } = useParams();
  useEffect(() => {
    axios.get('/recipe/detail?slug='+slug, {
      headers: {
      }
      , timeout: 10000
    }
    )
    .then(res => {
      setId(res.data.listing.id);
      setTitle(res.data.listing.title);
      setDescription(res.data.listing.description);
      setMealType(res.data.listing.meal_type);
      setAddedIngredients(res.data.listing.ingredients.map(x=>{return {'key':x.id,'name':x.name,'qty':x.qty};}));
    });
  },[slug]);
  // Ensure logged in
  useEffect(() => {
    //console.log('not logged in');
    //.log(user);
    if(!user || !user.access){
      navigate('/login');
    } 
  },[user]);
  //console.log(user);
  
  const handleSubmit = function(event) {
    event.preventDefault();

    // take form data 
    const formData = new FormData(event.target);
    formData.append('slug', slug);
    formData.append('is_published',true);
    axios.put('/recipe/manage',formData,{
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    })
    .then(res => {
      const listingid = id;
      addedIngredients.forEach(x => { 
        axios.post('/recipe/ingredient',{...x, 'listing':listingid },{
          headers: {
            Authorization: 'JWT '+user.access
          }
          , timeout: 10000
        })
      });
      navigate('/profile');
      
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
  const handleAdd = function(event) {
    const newKey = addedIngredients.length == 0 ? 0 : Math.max(...addedIngredients.map(x => x.key))+1;

    setAddedIngredients([...addedIngredients ,{'key':newKey,'name':currentIngredient,'qty':currentQty}]);
  }
  const handleDelete = function(key) {
    ;
    const idx = addedIngredients.findIndex(x=>x.key == key)
    addedIngredients.splice(idx,1);
  }
    return (
      <Container>
      <Row><Col>
        <h3>Create a new recipe</h3>
        { error ? <Alert key='primary' variant='primary'>
          { error }
        </Alert> : '' }

        <Form onSubmit={handleSubmit}> 
        
          <Form.Group className="mb-3" controlId="title">
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" placeholder="Chicken noodle soup" name="title" value={title} onChange={event=>setTitle(event.target.value)} /> 

          </Form.Group>
          
          <Form.Group controlId="main_photo" className="mb-3">
              <Form.Label>Photo of completed dish</Form.Label>
              <Form.Control type="file" name="main_photo" />
          </Form.Group>
          
          <Form.Group className="mb-3" controlId="mealtype">
          <Form.Label>Type of Dish</Form.Label>
            <Form.Select className="mb-3" name="meal_type" value={mealType} onChange={event=>setMealType(event.target.value)}>
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
              <option value="SNACK">Snack</option>
              <option value="DRINK">Drink</option>
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Ingredients</Form.Label>        
            <Table striped bordered hover>
            <thead>
            <tr>
            <th>
            <Form.Text className="text-muted">
            Select new ingredient<br/>
            </Form.Text><CreatableSelect options={ingredientReference}
                    onChange={v => {setCurrentIngredient(v.value)}}

            />
            </th>
            <th>
            <Form.Text className="text-muted">
            Qty
            </Form.Text>
            <Form.Control type="text" placeholder="1kg" value={currentQty} onChange={e=>setCurrentQty(e.target.value)} /> 
            </th>
            <th>

              <Button variant="primary" type="button" onClick={handleAdd} className="me-2">
                Add
              </Button>
              </th>
            </tr>
            </thead>
            <tbody>
            {addedIngredients.map(x=><tr key={x.key}><td>{x.name}</td><td>{x.qty}</td><td><a href="#" onClick={e=>{handleDelete(x.key);}}>x</a></td></tr>)}
            </tbody>
            </Table>
          </Form.Group> 
          <Form.Group className="mb-3" controlId="description">
            <Form.Label>Method</Form.Label>
            <Form.Control name="description" as="textarea" maxLength='10000' rows={3} value={description} onChange={event=>setDescription(event.target.value)} />
          </Form.Group> 
          <Button variant="primary" type="submit">
            Submit
          </Button>

        </Form>
        
      </Col></Row>
    </Container>
    );
  }
  
  export default EditRecipe;