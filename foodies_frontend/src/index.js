import React from 'react';
import ReactDOM from 'react-dom/client';

import Root from "./routes/Root";
import Profile from "./routes/Profile";
import ViewRecipe from "./routes/ViewRecipe";
import Search from "./routes/Search";
import CreateRecipe from "./routes/CreateRecipe";
import EditRecipe from "./routes/EditRecipe";
import Login from "./routes/Login";
import Register from "./routes/Register";
import ActivateAccount from "./routes/ActivateAccount";
import RequestResetPassword from "./routes/RequestResetPassword";
import ResetPassword from "./routes/ResetPassword";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import reportWebVitals from './reportWebVitals';

import { persistor, store } from './redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      {
        index: true,
        element: <Search />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "view-recipe/:slug",
        element: <ViewRecipe />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "activate-account/:uid/:token",
        element: <ActivateAccount />,
      },
      {
        path: "create-recipe",
        element: <CreateRecipe />,
      },
      {
        path: "edit-recipe/:slug",
        element: <EditRecipe />,
      },
      {
        path: "request-reset-password",
        element: <RequestResetPassword />,
      },
      {
        path: "reset-password/:uid/:token",
        element: <ResetPassword />,
      }
    ],
  },
]);
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ToastContainer />
        <RouterProvider router={router} />
      </PersistGate>
    </Provider> 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
