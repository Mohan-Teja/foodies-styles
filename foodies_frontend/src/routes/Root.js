import { Outlet, Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import React, { useState, useEffect } from "react";
import Search from '../components/Search';

import { styled, alpha } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Divider from '@mui/material/Divider';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CenterFocusWeakIcon from '@mui/icons-material/CenterFocusWeak';
import ChatIcon from '@mui/icons-material/Chat';
import { HowToReg, Login } from '@mui/icons-material';

import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

// import { toast } from 'react-toastify';

const StyledMenu = styled((props) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
        }}
        transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
        }}
        {...props}
    />
))(({ theme }) => ({
    '& .MuiPaper-root': {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
        boxShadow:
            'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
        '& .MuiMenu-list': {
            padding: '4px 0',
        },
        '& .MuiMenuItem-root': {
            '& .MuiSvgIcon-root': {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            '&:active': {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity,
                ),
            },
        },
    },
}));

function Root() {
    const [loading, setLoading] = useState(0);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const handleLogout = function (event) {
        event.preventDefault();
        setUser(null);
        navigate("/");
        localStorage.clear();
    }

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };


    useEffect(() => {
        if (!user && localStorage.getItem('user')) {
            const u = JSON.parse(localStorage.getItem('user'));
            axios.get('/auth/users/me/', {
                headers: {
                    Authorization: 'JWT ' + u.access
                }
                , timeout: 10000
            }
            )
                .then(res => {
                    setUser(u);
                })
                .catch(function (err) {
                    localStorage.clear();
                    navigate('/login');
                });
        }


        // Add a request interceptor
        axios.interceptors.request.use(function (config) {

            setLoading(loading + 1);

            return config;
        }, function (error) {
            setLoading(loading - 1);

            return Promise.reject(error);
        });

        // Add a response interceptor
        axios.interceptors.response.use(function (response) {
            setLoading(loading - 1);

            return response;
        }, function (error) {
            setLoading(loading - 1);

            return Promise.reject(error);
        });
    }, [loading, navigate, user]);


    return (
        <div className="flex flex-col">
            <header className='bg-[#f0f8ff] flex h-13 shadow-md w-full'>
                <div className="inline-flex">
                    <Link className="mt-1 uppercase no-underline" to="/">
                        <>
                            <div className="hidden md:flex space-x-2">
                                <image
                                    src='favicon.ico'
                                    alt='logo'
                                    width={20}
                                    height={10}
                                    className='block'
                                />
                                <div className='hidden md:block'>Foodies</div>
                            </div>
                            <div className="block md:hidden">
                                <image
                                    src='favicon.ico'
                                    alt='logo'
                                    width={30}
                                    height={30}
                                    className='block'
                                />
                            </div>
                        </>
                    </Link>
                </div>

                <div className='sm:block hidden md:block'>
                    <Search />
                </div>

                <div className="flex-initial">
                    <div className="flex justify-end items-center relative">
                        <div className="flex items-center">
                            <div>
                                {/* {
                                (is_contributor) ? (
                                    <>
                                        <AddRecipe />
                                    </>
                                ) : (
                                    <>
                                        {
                                            (user) ? (
                                                <div className="inline-block py-2 px-3 hover:bg-gray-200 rounded-full shadow-sm cursor-pointer">
                                                    <ChangeContributorStatus />
                                                </div>
                                                
                                            ) : (
                                                <Link to='/login'>
                                                    <div className="md:flex items-center relative cursor-pointer whitespace-nowrap hidden">Become a Contributor</div>
                                                </Link>
                                            )
                                        }
                                    </>


                                )
                            } */}

                            </div>
                            <div className="block relative">
                                <button type="button" className="inline-block py-2 px-2 hover:bg-gray-200 rounded-full relative ">
                                    <div className="flex items-center h-5">
                                        <div className="_xpkakx">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                                            </svg>
                                        </div>
                                    </div>
                                </button>
                            </div>
                        </div>
                        <div className="block">
                            <button
                                id="demo-customized-button"
                                aria-controls={open ? 'demo-customized-menu' : undefined}
                                aria-haspopup="true"
                                aria-expanded={open ? 'true' : undefined}
                                onClick={handleClick}
                                className="inline-flex items-center px-2 border rounded-full hover:shadow-lg"
                            >
                                <div className="pl-1">
                                    <svg
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="presentation"
                                        focusable="false"
                                        className="h-6 w-6 text-black stroke-current overflow-visible block"
                                    >
                                        <g fill="none" fillRule="nonzero">
                                            <path d="m2 16h28"></path>
                                            <path d="m2 24h28"></path>
                                            <path d="m2 8h28"></path>
                                        </g>
                                    </svg>
                                </div>

                                <div className="block flex-grow-0 flex-shrink-0 h-10 w-12 pl-4">
                                    <svg
                                        viewBox="0 0 32 32"
                                        xmlns="http://www.w3.org/2000/svg"
                                        aria-hidden="true"
                                        role="presentation"
                                        focusable="false"
                                        className="block fill-current mt-1"
                                    >
                                        <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
                                    </svg>
                                </div>
                            </button>
                            <StyledMenu
                                id="demo-customized-menu"
                                MenuListProps={{
                                    'aria-labelledby': 'demo-customized-button',
                                }}
                                anchorEl={anchorEl}
                                open={open}
                                onClose={handleClose}
                            >

                                {
                                    (user) ? (
                                        <MenuItem>
                                            <div className='flex flex-col'>
                                                <p className='font-semibold'>Logged in as</p>
                                                <Link to='/profile'>
                                                    <p className='ml-1 hover:underline'>{user.email}</p>
                                                </Link>
                                            </div>
                                        </MenuItem>
                                    ) : (
                                        <div>
                                            <MenuItem>
                                                <Link to='/register' className="no-underline text-inherit">
                                                    <>
                                                        <HowToReg />
                                                        Signup
                                                    </>
                                                </Link>
                                            </MenuItem>
                                            <MenuItem>
                                                <Link to='/login' className="no-underline text-inherit">
                                                    <>
                                                        <Login />
                                                        Login
                                                    </>
                                                </Link>

                                            </MenuItem>
                                        </div>

                                    )
                                }


                                <Divider sx={{ my: 0.5 }} />
                                <MenuItem>
                                    <CenterFocusWeakIcon />
                                    Scan
                                </MenuItem>
                                <MenuItem>
                                    <ChatIcon />
                                    Chat
                                </MenuItem>
                                <MenuItem>
                                    <MoreHorizIcon />
                                    More Help
                                </MenuItem>

                                {
                                    (user) ? (
                                        <div>
                                            <Divider sx={{ my: 0.5 }} />
                                            <MenuItem onClick={() => handleLogout()}>
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
                                                </svg>

                                                <span className='ml-2'>Logout</span>
                                            </MenuItem>
                                        </div>
                                    ) : null
                                }

                            </StyledMenu>
                        </div>
                    </div>
                </div>
            </header>
            
            <Navbar expand="lg" bg="light" className="mb-4">
      <Container>
      <Link className="navbar-brand" to="/">Foodie</Link>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
          <Link className="nav-link" to="/">Home</Link>
            {user ? <Link className="nav-link" to="/profile">Profile</Link> : ''}
            {user ? '' : <Link className="nav-link" to="/login">Login</Link>}
            {user ?  <Nav.Link href="#" onClick={handleLogout}>Logout</Nav.Link> : ''}
          </Nav>
        </Navbar.Collapse>
        {user && <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            Signed in as: {user.email}
          </Navbar.Text>
        </Navbar.Collapse>}
      </Container>
    </Navbar>

            <Outlet context={[user, setUser]} />

    </div>
  );
}

export default Root;
