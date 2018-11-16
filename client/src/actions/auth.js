import axios from 'axios';

import Auth from '../components/Common/Auth';

import { 
  AUTH_SIGN_UP,
  AUTH_ERROR,
  AUTH_SIGN_OUT,
  AUTH_SIGN_IN,
} from './types';


export const oauthGoogle = data => {
  return async dispatch => {
    const response = await axios.post('http://localhost:5000/api/auth/google', {
      access_token : data
    });

    dispatch({
      type : AUTH_SIGN_UP,
      payload : response.data.token
    });

    Auth.authenticateUser(response.data.token);
  };
};

export const oauthFacebook = data => {
  return async dispatch => {
    const response = await axios.post('http://localhost:5000/api/auth/facebook', {
      access_token : data
    });

    dispatch({
      type : AUTH_SIGN_UP,
      payload : response.data.token
    });

    Auth.authenticateUser(response.data.token);
  };
};

export const signUp = (data) => {
  return async dispatch => {
    /*
        Step 1) Use the data and make HTTP request to our BE and send it along
        Step 2) Take the BE's response (jwt is here now!)
        Step 3) Dispatch user just signed up (with jwt)
        Step 4) Save the jwt into localstorage
        */
    try {
      console.log('[ActionCreator] signUp called!');
      const response = await axios.post('http://localhost:5000/api/auth/signup', data);
      console.log('[ActionCreator] signUp dispatched an action!');
      dispatch({
        type : AUTH_SIGN_UP,
        payload : response.data.token
      });

      Auth.authenticateUser(response.data.token);
    } catch(err) {
      dispatch({
        type : AUTH_ERROR,
        payload: 'Email is already in use'
      });
      console.error('err', err);
    }
  };
};

export const signOut = () => {
  return dispatch => {
    Auth.deauthenticateUser();
    dispatch({
      type : AUTH_SIGN_OUT,
      payload : ''
    });
  };
};

export const signIn = (data) => {
  return async dispatch => {
    try {
      const response = await axios.post('http://localhost:5000/api/auth/signin', data);
       
      dispatch({
        type : AUTH_SIGN_IN,
        payload : response.data.token
      });

      Auth.authenticateUser(response.data.token);
    } catch(err) {
      dispatch({
        type : AUTH_ERROR,
        payload: 'Email is already in use'
      });
      console.error('err', err);
    }
  };
};

