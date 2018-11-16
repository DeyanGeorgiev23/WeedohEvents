import React, { Component } from 'react';

import * as actions from '../../actions';

import { connect } from 'react-redux';
import Auth from '../Common/Auth';

import Events from './Events';
import FindFriends from './FindFriends';
import Invites from './Invites';
import Requests from './Requests';
import YourFriends from './YourFriends';
import MakeEvent from './MakeEvent';
import Profile from './Profile';

import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
import ReactLoading from 'react-loading';
import ReactTooltip from 'react-tooltip';


class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading : false,
      eventsRequestsLength : '',
      userRequestsLength : '',
      activeTab : 'yourFriends',
      yourFriendsList: this.props.yourFriendsList || []
    };
    this.counter = this.counter.bind(this);
  }

  componentDidMount() {
    this.counter();
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.yourFriendsList !== nextProps.yourFriendsList) {
      this.setState({ userRequestsLength: this.state.userRequestsLength - 1 });
      if (this.state.userRequestsLength <= 0) {
        this.setState({ userRequestsLength: 0 });
      }
    }

    if (this.state.eventsRequestsLength !== nextProps.invitesLength.length) {
      this.setState({ eventsRequestsLength: nextProps.invitesLength.length });
    }
  }


  async counter() {
    let token = Auth.getToken();
    
    // All friends requests for each user
    let userRequests = await this.props.getRequest(token);
    let userRequestsLength = userRequests.payload.usersRequests.length;

    // All events requests for each user
    let eventsRequests = await this.props.getYourInvites(token);
    let eventsRequestsLength = eventsRequests.payload.allInvitedEvents.length;

    this.setState({ userRequestsLength : userRequestsLength, eventsRequestsLength : eventsRequestsLength });

  }

  render() {
    const { loading, eventsRequestsLength, userRequestsLength, activeTab } = this.state;
    return (
      <div>
        { loading 
          ?
          <div className="d-flex justify-content-center">
            <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
          </div>
          : 
          <div className="row">
            <Tabs
              defaultTab={ activeTab }
            >
              <TabList>
                <ReactTooltip />
                <Tab data-tip="Your Friends" tabFor="yourFriends"><img src="images/friends.png" alt="FRIENDS" />
                </Tab>
                <ReactTooltip />
                <Tab data-tip="Find Friends" tabFor="findFriends"><img src="images/users.png" alt="USERS" /></Tab>
                <ReactTooltip />
                <Tab data-tip="Friends Request" tabFor="friendsRequest"><img src="images/maps-and-flags.png" alt="REQUEST" /> 
                  <span className="badge badge-success">{ userRequestsLength ? userRequestsLength : '' }</span>
                </Tab>
                <ReactTooltip />
                <Tab data-tip="Your Events" tabFor="yourEvents"><img src="images/event.png" alt="EVENTS" /></Tab>
                <ReactTooltip />
                <Tab data-tip="Events you have been invited" tabFor="eventInvites"><img src="images/invitation.png" alt="INVITES" />
                  <span className="badge badge-success">{eventsRequestsLength ? eventsRequestsLength : ''}</span>
                </Tab>
                <ReactTooltip />
                <Tab data-tip="Create Event" tabFor="makeEvent"><img src="images/calendar2.png" alt="MAKE EVENT" /></Tab>
                <Tab data-tip="Profile" tabFor="profile"><img src="images/profile.png" alt="PROFILE" /></Tab>
              </TabList>

              <TabPanel tabId="yourFriends">
                <YourFriends />
              </TabPanel>
              <TabPanel tabId="findFriends">
                <FindFriends />
              </TabPanel>
              <TabPanel tabId="friendsRequest">
                <Requests />
              </TabPanel>
              <TabPanel tabId="yourEvents">
                <Events/>
              </TabPanel>
              <TabPanel tabId="eventInvites">
                <Invites />
              </TabPanel> 
              <TabPanel tabId="makeEvent">
                <MakeEvent/>
              </TabPanel>
              <TabPanel tabId="profile">
                <Profile />
              </TabPanel>  
            </Tabs>
            
          </div>
        }
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    invitedFriends: state.friends.invitedFriends,
    yourFriendsList: state.friends.yourFriendsList,
    invitesLength: state.events.invitesLength
  };
}

export default connect(mapStateToProps, actions)(Dashboard);
