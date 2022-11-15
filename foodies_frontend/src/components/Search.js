import { Divider, Popover } from '@mui/material';
import React from 'react'
import SearchPopup from './SearchPopup';

const Search = () => {
    
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'simple-popover' : undefined;
  
    return (
        <div>
            <button aria-describedby={id} onClick={handleClick} className='w-full px-19 border rounded-full shadow-md active:border-black focus:border-black'>
                <ul className='flex justify-evenly items-center space-x-5 font-semibold'>
                    <li className='ml-3 mt-2'>
                        Search by Recipe
                    </li>
                    <Divider orientation="vertical" flexItem />
                    <li className='mt-2'>
                        Search by Ingredient
                    </li>
                    <Divider orientation="vertical" flexItem />
                    <li className='flex pr-3 justify-evenly items-center space-x-2 font-semibold mt-2'>
                        <div className='opacity-60'>Scan</div>
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 bg-[#aad57d] px-1 py-1 rounded-full">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                            </svg>

                        </div>
                    </li>
                </ul>
            </button>
            <Popover
                id={id}
                open={open}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}

            >
                <div className='w-screen flex flex-col items-center p-4'>
                    <div className="relative py-5 flex justify-between space-x-2 rounded-full">
                        <div className="absolute">
                            <svg className="absolute text-slate-400 h-5 w-5 ml-5 mt-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input type="text" placeholder="Search" className="px-10 py-2 rounded-full text-black border border-black" />
                    </div>
                    <Divider orientation="horizontal" flexItem>
                        OR
                    </Divider>
                    <SearchPopup />
                </div>
            </Popover>
        </div>
  )
}

export default Search