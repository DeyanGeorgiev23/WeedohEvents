import { 
  GET_YOUR_EVENTS,
  GET_YOUR_INVITES 
} from '../actions/types';

const DEFAULT_STATE = {
  invitesLength : [],
  allCreatedEvents: []
};

export default (state = DEFAULT_STATE, action) => {
  switch(action.type) {
  case GET_YOUR_EVENTS: 
    return { ...state, allCreatedEvents: action.payload.allCreatedEvents  };
  case GET_YOUR_INVITES: 
    return { ...state, invitesLength: action.payload.allInvitedEvents };
  default: 
    return state;
  } 
};