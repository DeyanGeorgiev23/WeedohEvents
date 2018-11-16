import React, { Component } from 'react';

import NoData from '../Common/NoData';

import { connect } from 'react-redux';
import * as actions from '../../actions';

import Auth from '../Common/Auth';

import ReactLoading from 'react-loading';

class Invites extends Component {

  constructor(props) {
    super(props);

    this.state = {
      eventInvites : [],
      loading : false
    };

    this.invitesAnswer = this.invitesAnswer.bind(this);
  }

  componentDidMount() {
    this.getYourInvites();
  }
  

  async getYourInvites() {
    let token = Auth.getToken();

    let data = await this.props.getYourInvites(token);
    this.setState({eventInvites : data.payload.allInvitedEvents});
  }

  async invitesAnswer(e) {
    let token = Auth.getToken();
    let answer = e.target.id;
    let id = e.target.parentNode.id;
    this.setState({ loading : true });
    
    let data = await this.props.invitesAnswer(token, id, answer);

    if(data) {
      this.getYourInvites();
      await this.props.yourFriends(token);
      this.setState({ loading : false });
    }

  }
  
  render() {
    const { eventInvites, loading } = this.state;
    return (
      <div className="container mt-3">
        { loading 
          ?
          <div className="d-flex justify-content-center">
            <ReactLoading type={'bars'} color={'#343a40'} height={'20%'} width={'15%'} />
          </div>
          :
          eventInvites.length > 0
            ?
            eventInvites.map(x => {
              return (
                <div id={ x.eventId } style={{height : '100%', width : '100%'}} key={ x.eventId } className="event-panel mt-3">
                  <div className="invites-header bg-success">
                    <div style={{width : '100%'}} className="text-lg-center">
                      <cite className="mr-1">({ x.creator[0].username })</cite> <cite className="mr-1"> invite you in </cite> <strong className="text-danger mr-1 ml-1"> { x.title } </strong> <cite> event on </cite> <cite className="mr-2">{ x.date } at { x.hour }</cite>
                    </div>
                    
                  </div>
                  
                  <div className="card shadow-lg mb-3 text-lg-center">
                    <div className="card-body">
                      <div className="d-inline">
                        <p>{ x.description }</p>
                      </div>
                      <div className="text-lg-right d-inline" id={ x.eventId }>
                        <span onClick={ this.invitesAnswer } id="true" class="custom-badge badge badge-success badge-pill mr-2 waves-effect">I will go</span>
                        <span onClick={ this.invitesAnswer } id="false" class="custom-badge badge badge-danger badge-pill waves-effect">Ignore</span>
                      </div>
                       
                    </div>
                  </div>
               
                </div>
              );
            })
            : <NoData data={"You don't have any Event invites!"}/>
        }
      </div>       
    );
  }
}


function mapStateToProps(state) {
  return {
    invitesLength: state.events.invitesLength
  };
}

export default connect(mapStateToProps, actions)(Invites);
