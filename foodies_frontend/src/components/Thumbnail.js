// import { useState } from 'react'
import Rating from './Rating';
import SimpleImageSlider from "react-simple-image-slider";
// import { motion } from "framer-motion"

function Thumbnail({ recipe }) {

    // const [expanded, setExpanded] = useState(false);

    // const handleExpandClick = () => {
    //     setExpanded(!expanded);
    // };

    const images = [
        { url: `${recipe.recipe_main_photo}` },
        { url: `${recipe.recipe_photo1}` },
        { url: `${recipe.recipe_photo2}` },
        { url: `${recipe.recipe_photo3}` },
    ];

    return (
        <div 
            animate={{ opacity: recipe ? 1 : 0 }}
            className='flex flex-col bg-[#cce2b5] text-black w-100 h-100 p-3 rounded-md space-y-2 cursor-pointer'>
            <div>
                <>
                    <div>
                        <div className='relative rounded-full'>
                            <SimpleImageSlider
                                width={300}
                                height={250}
                                images={images}
                                showBullets={true}
                                showNavs={true}
                                slideDuration={1}
                                navSize={25}
                                navMargin={0}
                            />
                        </div>
                    </div>
                    <div>
                        {recipe.recipe_title}
                    </div>
                    <div>
                        <Rating value={recipe.recipe_rating} text={`${recipe.recipe_numReviews} reviews`} color={'#f8e825'} />
                    </div>
                    <div>
                        <div className='flex justify-between px-1'>
                            <div className='flex space-x-2'>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                </svg>

                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
                                </svg>

                            </div>
                            <div>
                                steps
                            </div>
                        </div>

                    </div>
                </>
            </div>
        </div>

    )
}

export default Thumbnail