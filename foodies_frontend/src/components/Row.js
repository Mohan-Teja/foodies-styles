import React from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid'
import { useRef, useState } from 'react'
import Thumbnail from './Thumbnail'

const Row = ({ title, allRecipes }) => {
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

  return (
    <div className="h-80 space-y-0.5 md:space-y-2 mt-10">
      <div className='flex justify-start'>
        <h2 className="w-full cursor-pointer text-lg font-bold transition duration-200 md:text-2xl">
          {title}
        </h2>
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
          {allRecipes.map((recipe) => (
            <Thumbnail key={recipe.id} recipe={recipe} />
          ))}
        </div>
        <ChevronRightIcon
          className="absolute top-0 bottom-0 right-2 z-40 m-auto h-9 w-9 cursor-pointer opacity-0 transition hover:scale-125 group-hover:opacity-100"
          onClick={() => handleClick('right')}
        />
      </div>
    </div>
  )
}

export default Row