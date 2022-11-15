import { useState, useEffect } from 'react'

import { Tab } from '@headlessui/react'
import classNames from 'classnames'

import axios from 'axios';

import { toast } from 'react-toastify';

import { useForm } from "react-hook-form";

import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Card from 'react-bootstrap/Card';
import CreatableSelect from 'react-select/creatable';
import ingredientReference from '../static/IngredientReference';
import Button from 'react-bootstrap/Button'

const SearchPopup = () => {

    const [ingredients, setIngredients] = useState([]);
    const [existIngredients, setExistIngredients] = useState([]);
    const [searchedlistings, setsearchedlistings] = useState([])
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
      
    const handleSubmit = function (event) {
        setOffset(0);
        event.preventDefault();
    
        const formData = new FormData(event.target);
    
        let params = new URLSearchParams();
        if (formData.has('search')) {
          params.append('search', formData.get('search'));
        }
        if (formData.has('method')) {
          params.append('method', formData.get('method'));
        }
        if (formData.has('price')) {
          params.append('price', formData.get('price'));
        }
        if (formData.has('meal_type')) {
    
          formData.getAll('meal_type').forEach(x => {
            params.append('meal_type', x);
          });
        }
        ingredients.forEach(x => {
          params.append('ingredient', x.value);
        });
        existIngredients.forEach(x => {
          params.append('existing_ingredient', x.value);
        });
        setSavedParams(params);
        axios.get('/recipe/search', { params: params, timeout: 10000 })
          .then(res => {
    
            setTitle('Search Results');
            setListings(appendAdjustedPrice(res.data.listings));

            setOffset(6);
          }).catch(function (err) {
            setListings([]);
            toast.error('No recipes to show', {
                position: toast.POSITION.TOP_CENTER
              });
          });
    
      }

    return (
        <div className="w-full py-2 sm:px-0">
            <Tab.Group>
                <Tab.List className="flex space-x-1 rounded-xl bg-blue-900/20 p-1 mr-10 ml-9">
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        Search with a Recipe Name
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        Search with an Ingredient Name
                    </Tab>
                    <Tab
                        className={({ selected }) =>
                            classNames(
                                'w-full rounded-lg py-2.5 text-sm font-medium leading-5 text-blue-700',
                                'ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none focus:ring-2',
                                selected
                                    ? 'bg-white shadow'
                                    : 'text-blue-500 hover:bg-white/[0.12] hover:text-white'
                            )
                        }
                    >
                        Scan a Food Item
                    </Tab>
                </Tab.List>
                <Tab.Panels className="mt-2">
                    <Tab.Panel>
                    <div sm={4}>

<Form className="mb-3" onSubmit={handleSubmit}>

  <Form.Group className="mb-3" controlId="title">
    <Form.Label>Title</Form.Label>
    <Form.Control type="text" name="search" placeholder="e.g. noodles" />
  </Form.Group>

  <Form.Group className="mb-3" controlId="method">
    <Form.Label>Method</Form.Label>
    <Form.Control type="text" name="method" placeholder="e.g. boil" />
  </Form.Group>

  <Form.Group className="mb-3" controlId="ingredient">
    <Form.Label>Ingredients</Form.Label>
    <CreatableSelect value={ingredients} onChange={v => setIngredients(v)} isMulti options={ingredientReference} />
  </Form.Group>

  <Card className="mb-3">
    <Card.Header>Meal Type</Card.Header>
    <Card.Body>
      <div className="mb-3">
        <Form.Check
          type={'checkbox'}
          id={'BREAKFAST'}
          value={'BREAKFAST'}
          label={'Breakfast'}
          name='meal_type'
        />
        <Form.Check
          type={'checkbox'}
          id={'LUNCH'}
          value={'LUNCH'}
          label={'Lunch'}
          name='meal_type'
        />
        <Form.Check
          type={'checkbox'}
          id={'DINNER'}
          value={'DINNER'}
          label={'Dinner'}
          name='meal_type'
        />
        <Form.Check
          type={'checkbox'}
          id={'SNACK'}
          value={'SNACK'}
          label={'Snack'}
          name='meal_type'
        />
        <Form.Check
          type={'checkbox'}
          id={'DRINK'}
          value={'DRINK'}
          label={'Drink'}
          name='meal_type'
        />
      </div>
    </Card.Body>
  </Card>

  <Card>
    <Card.Header>Estimated Price</Card.Header>
    <Card.Body>
      <div className="mb-3">
        <Form.Check
          type={'radio'}
          value={'All Recipes'}
          label={'All Recipes'}
          name='price'
        />
        <Form.Check
          type={'radio'}
          value={'<$5'}
          label={'<$5'}
          name='price'
        />
        <Form.Check
          type={'radio'}
          value={'$5-10'}
          label={'$5-10'}
          name='price'
        />
        <Form.Check
          type={'radio'}
          value={'$10-20'}
          label={'$10-20'}
          name='price'
        />
        <Form.Check
          type={'radio'}
          value={'$20+'}
          label={'$20+'}
          name='price'
        />
      </div>

      <Form.Group className="mt-3" controlId="ingredient">
        <Form.Label>Ingredients You Have (For Price Estimate)</Form.Label>
        <CreatableSelect value={existIngredients} onChange={v => setExistIngredients(v)} isMulti options={ingredientReference} />
      </Form.Group>
    </Card.Body>
  </Card>


  <Button variant="primary" type="submit" className="mt-3">
    Search
  </Button>
</Form>
</div>
                    </Tab.Panel>
                    <Tab.Panel>Content 2</Tab.Panel>
                    <Tab.Panel>Content 3</Tab.Panel>
                </Tab.Panels>
            </Tab.Group>
            <section className="md:space-y-24">
                {
                    (searchedlistings) ? (
                        <Row title="Result Recipes" allRecipes={searchedlistings} />
                    ) : null
                }
            </section>
        </div>
    )
}

export default SearchPopup