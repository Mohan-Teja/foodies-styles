import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { LinkContainer } from 'react-router-bootstrap'
import { useOutletContext } from "react-router-dom";
import Ratio from 'react-bootstrap/Ratio';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { useRef } from 'react'
import Rating from '../components/Rating';

function Search(props) {
  const [user, setUser] = useOutletContext();

  const [error, setError] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [subscriptionListings, setSubscriptionListings] = useState([]);
  const [existIngredients, setExistIngredients] = useState([]);
  const [listings, setListings] = useState([]);
  const [title, setTitle] = useState('Latest Recipies');
  const [offset, setOffset] = useState(0);
  const [savedParams, setSavedParams] = useState(new URLSearchParams());

  const appendAdjustedPrice = (listings) => {
    return listings.map(x => ({
      ...x, estimated_adjusted_total_price: (Number(x.estimated_total_price) -
        x.ingredients.filter(i => existIngredients.map(i => i.value).includes(i.name)).map(i => i.estimated_price).reduce((partialSum, a) => partialSum + a, 0)).toFixed(2)

    }));

  }

  // const moreResults = () => {
  //   let params = savedParams;
  //   params.set('offset', offset);
  //   axios.get('/recipe/search', { params: savedParams, timeout: 10000 })
  //     .then(res => {
  //       if (res.data.listings.length > 0) {
  //         setListings(x => [...x, ...appendAdjustedPrice(res.data.listings)]);
  //         setError(null);
  //         setOffset(x => x + 6);
  //       } else {

  //         setError('No more recipies to show.')
  //       }

  //     }).catch(function (err) {
  //       setError('No more recipies to show.')
  //     });
  // }

  useEffect(() => {
    axios.get('/recipe/search', { timeout: 10000 })
      .then(res => {
        setOffset(6);
        setListings(appendAdjustedPrice(res.data.listings));
        setError(null);
      }).catch(function (err) {
        setError('No recipies to show.')
      });

  }, []);

  useEffect(() => {
    if (user) {
      axios.get('/recipe/subscription-listings', {
        headers: {
          Authorization: 'JWT ' + user.access
        }, timeout: 10000
      })
        .then(res => {
          //setOffset(6);
          setSubscriptionListings(appendAdjustedPrice(res.data.listings));
          //setError(null);
        }).catch(function (err) {
          //setError('No recipies to show.')
        });
    } else {
      setSubscriptionListings([]);
    }
  }, [user]);

  const rowRef = useRef(null)
  const [isMoved, setIsMoved] = useState(false)

  const handleClick = (direction) => {
    setIsMoved(true)
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth
      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  console.log()

  return (
    <main className="relative pb-24 lg:space-y-30 lg:pl-16 ">
      <div className='flex flex-col justify-between  h-full space-y-10'>
        {/* {subscriptionListings.length > 0 && title === 'Latest Recipies' &&
            <Container>
              <Row>
                <h2>Recent Recipies from Subscriptions</h2>
                {subscriptionListings.map((l) =>
                (
                  <Col key={l.id}>
                    <Card className="m-1" style={{ width: '18rem' }} >
                      <Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.main_photo} /></Ratio>
                      <Card.Body>

                        <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Card.Title>{l.title}</Card.Title></Card.Link></LinkContainer>
                        <Card.Subtitle className="mb-2 text-muted">{l.meal_type}</Card.Subtitle>
                        <Card.Body>Estimated Price: ${l.estimated_total_price === l.estimated_adjusted_total_price ? l.estimated_total_price : <><s>{l.estimated_total_price}</s> ${l.estimated_adjusted_total_price}</>} </Card.Body>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>} */}

        <div className="space-y-0.5 md:space-y-2">
          <div className='flex justify-start'>
            <h2 className="w-full cursor-pointer text-lg font-bold transition duration-200 md:text-2xl">{title}</h2>
          </div>

          <div className="group relative md:-ml-2 px-2 pl-4">
            <ChevronLeftIcon
              className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && 'hidden'
                }`}
              onClick={() => handleClick('left')}
            />
            <div
              className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide md:space-x-10 md:p-2"
              ref={rowRef}
            >
              {listings.map((l) =>
              (
                <div className='md:hover:scale-105'>
                  <Col key={l.id} className='flex flex-col bg-[#cce2b5] text-black w-100 h-100 p-3 rounded-md space-y-2 cursor-pointer`'>
                  <Card className="m-1" style={{ width: '18rem' }} >
                  <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.main_photo} /></Ratio></Card.Link></LinkContainer>
                    <Card.Body>

                      <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Card.Title>{l.title}</Card.Title></Card.Link></LinkContainer>

                      <div>
                        <Rating value={l.rating} text={`${l.numReviews} reviews`} color={'#f8e825'} />
                      </div>

                      <Card.Subtitle className="mt-1 text-muted">{l.meal_type} - {l.ingredients.length} ingredients</Card.Subtitle>
                      <div className='flex justify-between'>
                        <div className='mt-2 font-semibold'>Estimated Price: ${l.estimated_total_price === l.estimated_adjusted_total_price ? l.estimated_total_price : <><s>{l.estimated_total_price}</s> ${l.estimated_adjusted_total_price}</>}</div>
                        <button type="button" className="btn btn-primary">STEPS</button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                </div>
              ))}
            </div>
            <ChevronRightIcon
              className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
              onClick={() => handleClick('right')}
            />
          </div>

        </div>

        <div className="space-y-0.5 md:space-y-2">
          <div className='flex justify-start'>
            <h2 className="w-full cursor-pointer text-lg font-bold transition duration-200 md:text-2xl">{title}</h2>
          </div>

          <div className="group relative md:-ml-2 px-2 pl-4">
            <ChevronLeftIcon
              className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && 'hidden'
                }`}
              onClick={() => handleClick('left')}
            />
            <div
              className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide md:space-x-10 md:p-2"
              ref={rowRef}
            >
              {listings.map((l) =>
              (
                <div className='md:hover:scale-105'>
                  <Col key={l.id} className='flex flex-col bg-[#cce2b5] text-black w-100 h-100 p-3 rounded-md space-y-2 cursor-pointer`'>
                  <Card className="m-1" style={{ width: '18rem' }} >
                  <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.main_photo} /></Ratio></Card.Link></LinkContainer>
                    <Card.Body>

                      <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Card.Title>{l.title}</Card.Title></Card.Link></LinkContainer>

                      <div>
                        <Rating value={l.rating} text={`${l.numReviews} reviews`} color={'#f8e825'} />
                      </div>

                      <Card.Subtitle className="mt-1 text-muted">{l.meal_type} - {l.ingredients.length} ingredients</Card.Subtitle>
                      <div className='flex justify-between'>
                        <div className='mt-2 font-semibold'>Estimated Price: ${l.estimated_total_price === l.estimated_adjusted_total_price ? l.estimated_total_price : <><s>{l.estimated_total_price}</s> ${l.estimated_adjusted_total_price}</>}</div>
                        <button type="button" className="btn btn-primary">STEPS</button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                </div>
              ))}
            </div>
            <ChevronRightIcon
              className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
              onClick={() => handleClick('right')}
            />
          </div>

        </div>

        <div className="space-y-0.5 md:space-y-2">
          <div className='flex justify-start'>
            <h2 className="w-full cursor-pointer text-lg font-bold transition duration-200 md:text-2xl">{title}</h2>
          </div>

          <div className="group relative md:-ml-2 px-2 pl-4">
            <ChevronLeftIcon
              className={`absolute top-0 bottom-0 left-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100 ${!isMoved && 'hidden'
                }`}
              onClick={() => handleClick('left')}
            />
            <div
              className="flex items-center space-x-2.5 overflow-x-scroll scrollbar-hide md:space-x-10 md:p-2"
              ref={rowRef}
            >
              {listings.map((l) =>
              (
                <div className='md:hover:scale-105'>
                  <Col key={l.id} className='flex flex-col bg-[#cce2b5] text-black w-100 h-100 p-3 rounded-md space-y-2 cursor-pointer`'>
                  <Card className="m-1" style={{ width: '18rem' }} >
                  <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Ratio aspectRatio='1x1'><Card.Img variant="top" src={l.main_photo} /></Ratio></Card.Link></LinkContainer>
                    <Card.Body>

                      <LinkContainer to={{ pathname: '/view-recipe/' + l.slug, search: '?' + savedParams.toString() }}><Card.Link><Card.Title>{l.title}</Card.Title></Card.Link></LinkContainer>

                      <div>
                        <Rating value={l.rating} text={`${l.numReviews} reviews`} color={'#f8e825'} />
                      </div>

                      <Card.Subtitle className="mt-1 text-muted">{l.meal_type} - {l.ingredients.length} ingredients</Card.Subtitle>
                      <div className='flex justify-between'>
                        <div className='mt-2 font-semibold'>Estimated Price: ${l.estimated_total_price === l.estimated_adjusted_total_price ? l.estimated_total_price : <><s>{l.estimated_total_price}</s> ${l.estimated_adjusted_total_price}</>}</div>
                        <button type="button" className="btn btn-primary">STEPS</button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                </div>
                
              ))}
            </div>
            <ChevronRightIcon
              className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
              onClick={() => handleClick('right')}
            />
          </div>

        </div>

      </div>
    </main>
  );
}

export default Search;