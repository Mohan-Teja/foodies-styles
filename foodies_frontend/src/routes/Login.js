import { useForm } from "react-hook-form"
import { ErrorMessage } from '@hookform/error-message';

import { useOutletContext, useNavigate } from "react-router-dom";

import axios from 'axios';
import React, { useState, useEffect } from 'react';

import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';

function Login(props) {
  const [user, setUser] = useOutletContext();
  const [success, setSuccess] = useState(false);
  const [reveal, setreveal] = useState(false)

  const { register, formState: { errors }, handleSubmit } = useForm();

  const navigate = useNavigate();

  const onSubmit = (data) => {

    axios.post('/auth/jwt/create/', data, { timeout: 10000 })
      .then(res => {
        axios.get('/auth/users/me/', {
          headers: {
            Authorization: 'JWT ' + res.data.access
          }
          , timeout: 10000
        }
        )
          .then(res2 => {
            setUser({ ...res.data, id: res2.data.id, email: res2.data.email });
            localStorage.setItem("user", JSON.stringify({ ...res.data, id: res2.data.id, email: res2.data.email }))
            toast.success('Logged in Successfully', {
              position: toast.POSITION.TOP_CENTER
            });
            setSuccess(true);
          }).catch(function (err) {
            console.log(err);
            let errorMessage = '';
            const responseData = err.response.data;
            const k = Object.keys(responseData)[0];
            const v = responseData[k];

            if (Array.isArray(v)) {
              errorMessage = k + ': ' + v[0];
            } else {
              errorMessage = k + ': ' + v;
            }
            toast.error(errorMessage, {
              position: toast.POSITION.TOP_CENTER
            });
          });



      }).catch(function (err) {
        console.log(err);
        let errorMessage = '';
        const responseData = err.response.data;
        const k = Object.keys(responseData)[0];
        const v = responseData[k];

        if (Array.isArray(v)) {
          errorMessage = k + ': ' + v[0];
        } else {
          errorMessage = k + ': ' + v;
        }

        toast.error(errorMessage, {
          position: toast.POSITION.TOP_CENTER
        });
      });

  }

  useEffect(() => {

    if (success && user) {
      navigate('/profile');
    }
  }, [user, success, navigate]);

  return (
    <section className='grid place-items-center mt-20'>
      <form className='flex flex-col space-y-3 justify-center color-text-black' onSubmit={handleSubmit(onSubmit)}>
        <h2 className='uppercase flex justify-center text-lg font-extrabold text-[#061d32]'>Log In</h2>
        <input
          type="email"
          className="text-[#061d32] border border-black form-input px-4 py-3 rounded-full w-80 peer invalid:border-red-500 invalid:text-red-600 focus:invalid:border-red-500 focus:invalid:ring-red-500 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
          placeholder='Email...'
          {...register("email", { required: 'Email is required.' })}
        />
        <ErrorMessage
          errors={errors}
          name="email"
          render={({ message }) => <p className="text-red-600 text-sm ml-4">{message}</p>}
        />
        <>
          {
            (reveal) ? (
              <div className='flex justify-end'>
                <input
                  type="text"
                  className="form-input border border-black px-4 py-3 rounded-full w-80 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-black"
                  placeholder='Password...'
                  {...register("password", {
                    required: 'Password is required.',
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters"
                    }
                  })}
                />
                <div
                  onClick={() => setreveal(false)}
                  className='text-black absolute mt-3 mr-4 cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <title className='text-black'>Hide Password</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
                  </svg>
                </div>
              </div>
            ) : (
              <div className='flex justify-end'>
                <input
                  type="password"
                  className="form-input px-4 py-3 rounded-full w-80 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 text-black border border-black"
                  placeholder='Password...'
                  {...register("password", {
                    required: 'Password is required.',
                    minLength: {
                      value: 8,
                      message: "Password must have at least 8 characters"
                    }
                  })}
                />
                <div
                  onClick={() => setreveal(true)}
                  className='text-black absolute mt-3 mr-4 cursor-pointer'>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <title className='text-black'>Show Password</title>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>

                </div>
              </div>
            )
          }
        </>

        <ErrorMessage
          errors={errors}
          name="password"
          render={({ message }) => <p className="text-red-600 text-sm ml-4">{message}</p>}
        />
        <div className='flex justify-between'>
          <div className='space-x-2 flex align-middle'>
            <div>
              <input type="checkbox" name='remember' className="
                                rounded text-green-500 shadow-sm
                                focus:border-green-300
                                focus:ring
                                focus:ring-offset-0
                                focus:ring-green-200
                                focus:ring-opacity-50" />
              <label htmlFor='remember' className='ml-2 text-green-700'>Remember me</label>
            </div>
          </div>
          <div className='text-red-500 hover:underline'>
            <Link to='/request-reset-password'>Forgot Password?</Link>
          </div>
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-full uppercase text-lg cursor-pointer active:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300 w-80"
        >
          Log in
        </button>

        <div className='flex'>
          <p className='text-gray-700'>Dont Have an Account?</p>
          <div className='text-green-900 hover:underline ml-1 font-semibold'>
            <Link to='/register'>Signup</Link>
          </div>
        </div>
      </form>
    </section>
  );
}



export default Login;