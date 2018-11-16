import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import authReducer from './auth';
import friendsReducer from './friends';
import eventsReducer from './events';

export default combineReducers({
  form : formReducer,
  auth : authReducer,
  friends : friendsReducer,
  events : eventsReducer
});
