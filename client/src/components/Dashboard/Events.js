import React, { Component } from 'react';
import ReactTooltip from 'react-tooltip';

import NoData from '../Common/NoData';
import ModalCenter from '../Common/ModalCenter';
import Modal from '../Common/Modal';
import DeleteEvent from '../Common/DeleteEvent';

import Auth from '../Common/Auth';

import { connect } from 'react-redux';
import * as actions from '../../actions';

class Events extends Component {

  constructor(props) {
    super(props);
    
    this.state = {
      allCreatedEvents : [],
      loading : true
    };

    this.deleteEvent = this.deleteEvent.bind(this);
  }

  componentDidMount() {
    this.getAllUserEvents();
  }
  
  componentWillReceiveProps(nextProps) {
    if (this.state.allCreatedEvents !== nextProps.allCreatedEvents) {
      this.setState({ allCreatedEvents: nextProps.allCreatedEvents });
    }
  }

  dateSplitter(date) {
    date = date.slice(0, 10);
    return date;
  };
  
  monthChecker(date) {
    let currentMonth = date.split('-')[1];
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    return {
      month : months[currentMonth - 1],
      day : date.split('-')[2],
      year : date.split('-')[0]
    };
  };


  async getAllUserEvents() {
    let token = Auth.getToken();
    let data = await this.props.getAllUserEvents(token);
    console.log(data);
    this.setState({allCreatedEvents : data.payload.allCreatedEvents});
  }


  async deleteEvent(e) {
    let token = Auth.getToken();
    let eventId = e.target.parentNode.id;

    
    let data = await this.props.deleteEvent(token, eventId);

    console.log(data);
  }

  render() {
    const { allCreatedEvents } = this.state;
    
    return (
      <div className="mt-3">
        { allCreatedEvents.length > 0
          ? 
          allCreatedEvents.map(event => {
            return (
              <div key={ event.eventId } id={ event.eventId } className="event-panel mb-5">
                <DeleteEvent eventId={ event.eventId } deleteEvent={ this.deleteEvent } />
                <ReactTooltip />
                {event.isPrivate 
                  ?
                  <img data-tip="Private Event" style={{float : 'right', padding : '4px'}} src="images/folder.png" alt="PRIVATE"/>
                  : null}
                <div className="event-header gradient">{ event.title }</div>
                <div className="event-content">

                  <div className="card shadow-lg mb-3">
                    <div className="card-body">
                      <div className="row">

                        <div className="col-lg-2">
                          <div className="small-calendar">
                            <div className="small-calendar-header">Calendar</div>
                            <p>{ this.monthChecker(event.date).year }</p>
                            <p>{ this.monthChecker(event.date).month }</p>
                            <p>{ this.monthChecker(event.date).day }</p>
                          </div>
                        </div>

                        <div className="col-lg-3">
                          <div className="small-clock">
                            <div className="small-clock-header">hour</div>
                            <p>{ event.hour.split(':')[0] }</p>
                          </div>
                                :
                          <div className="small-clock">
                            <div className="small-clock-header">minutes</div>
                            <p>{ event.hour.split(':')[1] }</p>
                          </div>
                        </div>

                        <div className="col-lg-4">
                          <p>{ event.description }</p>
                          <ModalCenter event={ event }/>
                        </div>

                        <div className="col-lg-3">
                          <div id={ event.eventId }>
                            <cite>{ event.participants.length } of { event.numberOfParticipants } participant</cite><br/>
                            <meter style={{width : '120px'}} value={ event.participants.length } min="0" max={ event.numberOfParticipants }></meter>
                                       
                          </div>
                          {
                            event.participants.length > 0
                              ?
                              <Modal data={event.participants}/>
                              :
                              <NoData data="No participants yet!"/>
                          }
                        </div>
                      </div>

                      <div style={{ float: 'left' }}>
                        <small><strong>Created on: </strong>
                          { this.monthChecker(this.dateSplitter(event.dateCreate)).day }-
                          { this.monthChecker(this.dateSplitter(event.dateCreate)).month }-
                          { this.monthChecker(this.dateSplitter(event.dateCreate)).year } </small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
          : <NoData data="You have't created events yet!"/>
        }
      </div>
    );
  }
}


function mapStateToProps(state) {
  return {
    errorMessage: state.auth.errorMessage,
    allCreatedEvents: state.events.allCreatedEvents
  };
}

export default connect(mapStateToProps, actions)(Events);
