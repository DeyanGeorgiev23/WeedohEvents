import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import reducers from './reducers/index';
import reduxThunk from 'redux-thunk';
import 'react-web-tabs/dist/react-web-tabs.css';

import Auth from './components/Common/Auth';

import App from './components/App';
import * as serviceWorker from './serviceWorker';


ReactDOM.render(
  <Provider store={createStore(reducers, {
    auth : {
      token : Auth.getToken(),
      isAuthenticated : Auth.isUserAuthenticated()
    },
    friends : {
      invitedFriends: [],
      yourFriendsList: [],
      allUsersList: [],
      personalData: []
    },
    events: {
      allCreatedEvents: [],
      invitesLength: []
    }
  }, applyMiddleware(reduxThunk))}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>, document.getElementById('root'));
serviceWorker.unregister();
