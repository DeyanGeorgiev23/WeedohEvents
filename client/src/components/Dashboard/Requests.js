import React, { Component } from 'react';

import NoData from '../Common/NoData';

import Auth from '../Common/Auth';

import { connect } from 'react-redux';
import * as actions from '../../actions';

class Requests extends Component {
  constructor(props) {
    super(props); 

    this.state = {
      invitedFriends: [],
      friends: []
    };

    this.friendsRequests = this.friendsRequests.bind(this);
    this.friendsReqAnswer = this.friendsReqAnswer.bind(this);

  }

  componentDidMount() {
    this.friendsRequests();
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.state.invitedFriends !== nextProps.invitedFriends) {
      this.setState({ invitedFriends: nextProps.invitedFriends });
    }
  }

  async friendsRequests() {
    let token = Auth.getToken();
    let data = await this.props.getRequest(token);
    this.setState({invitedFriends : data.payload.usersRequests});
  }

  async friendsReqAnswer(e) {
    let answer = e.target.id;
    
    let token = Auth.getToken();
    let id = e.target.parentElement.id;
    let element = e.target.parentNode;
    element.parentNode.removeChild(element);

    let data = await this.props.friendReqAnswer(token, id, answer);   

    if (data) {
      this.setState({ friends: data.payload.friends });
    }
  }

  render() {
    const { invitedFriends } = this.state;
    return (
      <div className="mt-3">
        {invitedFriends.length > 0 
          ?
          invitedFriends.map(data => {
            return (
              <div id={ data.id } key={ data.id } className="pt-1">
                <ul className="list-group">
                  <li id={ data.id }  class="list-group-item d-flex justify-content-between align-items-center shadow mb-1">
                    { data.username }  <small>{ data.email }</small>
                    <span onClick={ this.friendsReqAnswer } id="yes" class="custom-badge badge badge-success badge-pill waves-effect">Accept</span>
                    <span onClick={ this.friendsReqAnswer } id="no" class="custom-badge badge badge-danger badge-pill waves-effect">Decline</span>
                  </li>
                </ul>
              </div>
            ); 
          }) 
            
          : <NoData data={"There is no requests yet!"}/> }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    invitedFriends: state.friends.invitedFriends
  };
}

export default connect(mapStateToProps, actions)(Requests);
