import { 
  FIND_FRIENDS,
  INVITE_FRIEND,
  YOUR_FRIENDS,
  PROFILE_DATA } from '../actions/types';

const DEFAULT_STATE = {
  invitedFriends: [],
  yourFriendsList: [],
  allUsersList: [],
  personalData: []
};

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
  case FIND_FRIENDS:
    return { ...state, allUsersList: action.payload.users };
  case INVITE_FRIEND:
    return { ...state, invitedFriends: action.payload.usersRequests };
  case YOUR_FRIENDS: 
    return { ...state, yourFriendsList: action.payload.friends }; 
  case PROFILE_DATA:
    return { ...state, personalData: action.payload.user };
  default: 
    return state;
  } 
};