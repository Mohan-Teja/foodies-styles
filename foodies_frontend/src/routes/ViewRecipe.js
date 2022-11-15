import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Image from 'react-bootstrap/Image'
import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from 'axios';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { useOutletContext } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import Ratio from 'react-bootstrap/Ratio';
import { LinkContainer } from 'react-router-bootstrap'
import Card from 'react-bootstrap/Card';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

function ViewRecipe(props) {

  //let comments = []...
  let [comments, setComments] = useState([]);
  let [subscriptions, setSubscriptions] = useState([]);
  let [searchParams, setSearchParams] = useSearchParams();

  // comments = ['a,b,c']
  // setComments(['a','b','c'])
  
  // useEffects

  
  let { slug } = useParams();
  let [user, setUser] = useOutletContext();
  let [userDetail, setUserDetail] = useState({username:'',email:'',id:'',is_contributor:false});
  let [ recipe , setRecipe ] = useState({
    contributor:'',title:'',description:'',meal_type:'',ingredients:[],likes:[]
  });
  let [error, setError] = useState(null);
  let [similar, setSimilar] = useState([]);
  const [showTipModal, setShowTipModal] = useState(false);
  const [selectedIcon, setSelectedIcon] = useState(1);
  const [tipMessage, setTipMessage] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardError, setCardError] = useState('');
  
  function loadComments (id){
    axios.get('/recipe/comment?listing='+id, {
      headers: {
      }
      , timeout: 10000
    }
    )
    .then(res => {
      setComments(res.data.comments);

    });
    //setComments([{text:'abc'},{text:'bcd'}]);
  }

  
  function submitComment(event){
    event.preventDefault();
    const formData = new FormData(event.target);
    let obj = {};
    // take form data and turn into json object. the 'name' in the form input should match the API
    formData.forEach((value, key) => obj[key] = value);
    obj['listing_id'] = recipe.id;
    
    axios.post('/recipe/comment-manage',obj,{timeout: 10000,
    headers: {
      Authorization: 'JWT '+user.access
    }})
    .then(res => {
      loadComments(recipe.id);
    }).catch(function (err) {
      
    });
    
  }

  function toggleLike(event){
    //console.log(user);
    event.preventDefault();
    let obj = {};
    obj['listing_id'] = recipe.id;
    
    axios.post('/recipe/toggle-like',obj,{timeout: 10000,
    headers: {
      Authorization: 'JWT '+user.access
    }})
    .then(res => {
      axios.get('/recipe/detail?slug='+slug, {
        headers: {
        }
        , timeout: 10000
      }
      )
      .then(res => {
        refreshRecipe(res);
        //console.log(res);
      });
    }).catch(function (err) {
      
    });
    
  }
  const refreshRecipe = (res)=>{
    setRecipe({...res.data.listing,estimated_adjusted_total_price:(Number(res.data.listing.estimated_total_price)-
      res.data.listing.ingredients.filter(i=> searchParams.getAll('existing_ingredient').includes(i.name)).map(i=>i.estimated_price).reduce((partialSum, a) => partialSum + a, 0)).toFixed(2)});
  }
  useEffect(() => {
    axios.get('/recipe/detail?slug='+slug, {
      headers: {
      }
      , timeout: 10000
    }
    )
    .then(res => {
      refreshRecipe(res);
      loadComments(res.data.listing.id);
      
      axios.get('/recipe/similar?slug='+slug, {
        headers: {
        }
        , timeout: 10000
      }
      )
      .then(res => {
        setSimilar(res.data);
      });
    });

  },[slug]);
  useEffect(() => {
    if(recipe.contributor){
      axios.get('/users/user?id='+recipe.contributor, {
        headers: {
        }
        , timeout: 10000
      })
      .then(res => {
        setUserDetail(res.data.user);
      });
    }
  },[recipe]);
  
  useEffect(() => {
    if(userDetail && user){
      getSubscriptions();
    }
  },[userDetail]);
  const getSubscriptions = ()=> {
    axios.get('/users/subscriptions', {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    })
    .then(res => {
      setSubscriptions(res.data.subscriptions.subscriptions);
    });
  }
  const subscribe = ()=> {
    axios.get('/users/subscribe?id='+recipe.contributor, {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    })
    .then(res => {
      getSubscriptions();
    });
  }
  const unsubscribe = ()=> {
    axios.get('/users/unsubscribe?id='+recipe.contributor, {
      headers: {
        Authorization: 'JWT '+user.access
      }
      , timeout: 10000
    })
    .then(res => {
      getSubscriptions();
    });
  }
  const handleAdd = function(id,form) {
    if(!user || !user.access){
      setError('You must be logged in to submit price data');
    } else{
      const p = parseFloat(form.get('price'));
      if(!isNaN(p)){
        axios.post('/recipe/ipc?id='+id,{price:p.toFixed(2)},{
          headers: {
            Authorization: 'JWT '+user.access
          }
          , timeout: 10000
         }).then(x=>{
            axios.get('/recipe/detail?slug='+slug, {
              headers: {
              }
              , timeout: 10000
            })
            .then(res => {
              refreshRecipe(res);
            });
            setError("Successfully submitted price");
         })
         .catch(function (err) {
          console.log(err);
          const responseData = err.message;

          
          setError(responseData);
        });
        
      }
    }
  };
  function processTip(event){
    //console.log(user);
    event.preventDefault();
    let obj = {};
    obj['icon'] = selectedIcon;
    obj['recipient_id'] = userDetail.id;
    obj['sender_id'] = user.id;
    obj['message'] = tipMessage;
    
    var valid = require("card-validator");

    if(!valid.number(cardNumber).isValid){
     setCardError('Credit card number is invalid');
     return;
    }
    
    if(!valid.expirationDate(cardExpiry).isValid){
      setCardError('Credit card expiry date is invalid');
      return;
     }
    
     if(!valid.cvv(cardCvv).isValid){
      setCardError('Credit card CVV is invalid');
      return;
     }
     
    axios.post('/users/tip',obj,{timeout: 10000,
    headers: {
      Authorization: 'JWT '+user.access
    }})
    .then(res => {

        axios.get('/recipe/detail?slug='+slug, {
          headers: {
          }
          , timeout: 10000
        }
        )
        .then(res => {
          refreshRecipe(res);
          setShowTipModal(false);
          setError("Thanks for tipping.");
        });

        
    }).catch(function (err) {
      
    });
    
  }
  
    return (
      <Container>
        <Row>
        { error ? <Alert key='primary' variant='primary'>
          { error }
        </Alert> : '' }
        <Col sm={4}>
          <h4>Contributor</h4>
          <p>Display Name: {userDetail.username}</p>
          <p>Profile Description: {userDetail.profile_description}</p>

          <Image src={userDetail.profile_photo} fluid rounded style={{'maxWidth':'220px'}}/>
          <Container className="mt-4">
          {user && <>
          {subscriptions.includes(recipe.contributor) ? <Button variant="outline-primary" onClick={unsubscribe}>Unsubscribe</Button> : <Button onClick={subscribe}>Subscribe</Button>}
          {<Button className="ms-3" variant="outline-primary" onClick={()=>setShowTipModal(true)}>Tip</Button>}
              <Modal show={showTipModal} onHide={()=>setShowTipModal(false)}><Form onSubmit={processTip}>
                <Modal.Header closeButton>
                  <Modal.Title>Tip {userDetail.username}</Modal.Title>
                </Modal.Header>
                <Modal.Body><h6>Select an award</h6>
                
                <div  className="mb-3">
                  <ButtonGroup>
                    <Button size="lg" onClick={()=>{setSelectedIcon(1)}} active={selectedIcon==1} variant="light">&#x2764;</Button>
                    <Button size="lg" onClick={()=>{setSelectedIcon(2)}} active={selectedIcon==2} variant="light">&#x1F49D;</Button>
                    <Button size="lg" onClick={()=>{setSelectedIcon(3)}} active={selectedIcon==3} variant="light">&#x1F3C5;</Button>
                    <Button size="lg" onClick={()=>{setSelectedIcon(4)}} active={selectedIcon==4} variant="light">&#x1f3c6;</Button>
                    <Button size="lg" onClick={()=>{setSelectedIcon(5)}} active={selectedIcon==5} variant="light">&#x1F995;</Button>
                  </ButtonGroup>
                </div>
                
                <Form.Group className="mb-3" controlId="expiry">
                      <Form.Label>Your name to display publically as a supporter</Form.Label>
                      <Form.Control value={tipMessage} onChange={e=>setTipMessage(e.target.value)} type="text" inputMode="text" maxLength="100" placeholder="e.g. Mr. Gru" />
                </Form.Group>
                    
                <Card>
                  <Card.Body><h6>Pay ${selectedIcon} now</h6>
                  { cardError ? <Alert key='primary' variant='primary'>
                    { cardError }
                  </Alert> : '' }
                    <Form.Group className="mb-3" controlId="cardnum">
                      <Form.Label>Card Number</Form.Label>
                      <Form.Control value={cardNumber} onChange={e=>setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 '))} type="tel" inputMode="numeric"  maxLength="19" placeholder="xxxx xxxx xxxx xxxx" />
                    </Form.Group>
                    <Row>
                      <Col>
                    <Form.Group className="mb-3" controlId="expiry">
                      <Form.Label>Expiry</Form.Label>
                      <Form.Control value={cardExpiry} onChange={e=>setCardExpiry((s)=>{
                        if (e.target.value.replace(/\D/g,'').length==2 && !s.includes('/')) {
                          return e.target.value.replace(/\D/g,'') + '/';
                        } else {
                          return e.target.value;
                        }
                        // e.target.value.replace(/\D/g,'') + '/' : e.target.value.substring(0,2).replace(/\D/g,'') + '/' + e.target.value.substring(3).replace(/\D/g,'')  )
                      })} type="text" inputMode="text" maxLength="5" placeholder="12/25" />
                    </Form.Group>
                    </Col><Col>
                    <Form.Group className="mb-3" controlId="cvv">
                      <Form.Label>CVV</Form.Label>
                      <Form.Control value={cardCvv} onChange={e=>setCardCvv(e.target.value.replace(/\D/g,''))} type="tel" inputMode="numeric" maxLength="4" placeholder="xxx" />
                    </Form.Group>
                    </Col>
                    </Row>
                  
                  </Card.Body>
                </Card>
                </Modal.Body>
                <Modal.Footer>

                  <Button disabled={!cardCvv || !cardNumber || !cardExpiry || !tipMessage} type="submit" variant="primary">
                    Pay Now
                  </Button>
                </Modal.Footer>
                </Form></Modal>
          </>
          }
          </Container>
          {userDetail.received_tips && userDetail.received_tips.length > 0 && <Container className='mt-3'><h4>Received Tips</h4>{userDetail.received_tips.map((x,i)=>
            <OverlayTrigger
              key = {i}
              placement="right"
              delay={{ show: 250, hide: 400 }}
              overlay={<Tooltip>
              {x.message}
            </Tooltip>}
            ><Button size="lg" variant="light" className='m-1'>{x.icon == 1 && <>&#x2764;</>}
            {x.icon == 2 && <>&#x1F49D;</>}
            {x.icon == 3 && <>&#x1F3C5;</>}
            {x.icon == 4 && <>&#x1f3c6;</>}
            {x.icon == 5 && <>&#x1F995;</>}</Button></OverlayTrigger>)}
          </Container>}
        </Col>                    

        <Col>
          <h3>Recipe: {recipe.title}</h3>
          <div className="float-md-end">{ (user && recipe.likes.includes(user.id)) && <Button variant="outline-danger" onClick={toggleLike}>Unlike</Button>}
          { (user && !recipe.likes.includes(user.id)) && <Button variant="danger" onClick={toggleLike}>Like</Button>}
          <p>{recipe.likes.length} likes</p></div>

          <p><small><i>Created: {recipe.date_created}</i></small></p>
          <p>Meal type: {recipe.meal_type}</p>
          <Image src={recipe.main_photo} fluid />
          <h4 className='mt-1'>Ingredients</h4>
          
          <Table striped bordered hover>
          <thead>
          <tr><th>Name</th><th>Qty</th><th>Estinated Price</th><th>    <OverlayTrigger
                                                                  placement="right"
                                                                  delay={{ show: 250, hide: 400 }}
                                                                  overlay={<Tooltip id="tooltip">
                                                                  Submit your cost of the ingredient to make this recipe. This helps improve the ingredient price estimate for all users.
                                                                </Tooltip>}
    ><span style={{textDecoration: 'underline'}}>Submit Price Data</span></OverlayTrigger></th></tr>
          </thead>
          <tbody>
          
          {recipe.ingredients.map(i => (
            <tr key={i.id}><td>{i.name}</td><td>{i.qty}</td><td>${searchParams.getAll('existing_ingredient').includes(i.name) ? <><s>{i.estimated_price}</s> $0</> : i.estimated_price}</td><td>
            <Form key={i.id} onSubmit={(e)=>{e.preventDefault();
            handleAdd(i.id,new FormData(e.target));}}><Form.Group className="" controlId="title">
            <Form.Control type="text" placeholder="1.20" className="me-1" name="price" style={{width:'70px',display:'inline-block'}} /> 
            <Button variant="primary" type="submit">
                Add
              </Button>
            </Form.Group></Form></td></tr>
          ))}
          </tbody>
          </Table>
          <p>Estimated Total Price: ${recipe.estimated_total_price==recipe.estimated_adjusted_total_price ? recipe.estimated_total_price : <><s>{recipe.estimated_total_price}</s> ${recipe.estimated_adjusted_total_price}</> } </p>
          <p><small>All estimated prices are in AUD and based on user contributed data in Australia.</small></p>
          <h4>Method</h4>
          <p style={{whiteSpace: 'pre-line'}}>{recipe.description}</p>
          
          <h4>Comments</h4>
          {user && <form onSubmit={submitComment}>
          <textarea className="form-control mb-1" rows="3" placeholder="Type comment here..." name="text"></textarea>
          <input className="btn btn-primary" type="submit" value="Add" />
          </form>}
          
          {!user && <p><em>Only logged in users can post comments.</em></p>}
          
          
          {comments.map(x=>(<figure key={x.id} className="figure" style={{width:'100%'}} >
          <figcaption className="figure-caption">Posted at {(new Date(x.date_created)).toLocaleString()} by {x.username}</figcaption>
          <p>{x.text}</p>
          </figure>))}
          
          {similar && similar.length > 0 &&<Row>
          <h4>Similar Recipies</h4>
          {similar.map((l) =>
                    (
                      <Col key={l.recipe.id}>
                      <Card className="m-1" style={{ width: '18rem' }} >
                      <Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.recipe.main_photo}  /></Ratio>
                      <Card.Body>
                      
                        <LinkContainer to={{pathname:'/view-recipe/'+l.recipe.slug}}><Card.Link><Card.Title>{l.recipe.title}</Card.Title></Card.Link></LinkContainer>
                        <Card.Subtitle className="mb-2 text-muted">{l.recipe.meal_type}</Card.Subtitle>
                        <Card.Body>Similarity Score: {(l.cosine_similarity*100).toFixed(0)}/100</Card.Body>
                      </Card.Body>
                    </Card>
                    </Col>
                    ))}
          </Row>}
        </Col></Row>
      </Container>
    );
  }
  
  export default ViewRecipe;