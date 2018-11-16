import React, { Component } from 'react';

import ReactTooltip from 'react-tooltip';

import Modal from '../components/Common/Modal';

import NoData from './Common/NoData';

import Auth from './Common/Auth';

import ScrollUpButton from "react-scroll-up-button";

export default class Event extends Component {
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


  render() {
    let { events, joinEvent, leaveEvent, errorMsg, successMsg } = this.props;
    return (
      <div className="container">
        {events
          ?
          events.map((event, i) => {
            return (
              <div id={ i } key={ event.eventId } className="event-panel mb-5">
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

                        <div className="col-lg-2.5">
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

                        <div className="col-lg-5">
                          <p>{ event.description }</p>
                        </div>

                        <div className="col-lg-3">
                          <div id={ event.eventId }>
                            <cite>{ event.participants.length } of { event.numberOfParticipants } participant</cite><br/>
                            {Auth.isUserAuthenticated()
                              ?
                              <img data-tip="Join in this Event!" onClick={joinEvent} src="images/plus.png" alt="ADD" id="add-image-btn"/>
                              : null }
                            <meter style={{width : '120px'}} value={ event.participants.length } min="0" max={ event.numberOfParticipants }></meter>
                            <ReactTooltip />
                            {Auth.isUserAuthenticated()
                              ?
                              <img data-tip="Leave this event!" onClick={leaveEvent} src="images/remove.png" alt="ADD" id="add-image-btn"/>
                              : null }       
                            { errorMsg 
                              ?
                              <div className="alert-danger">{ errorMsg[event.eventId] }</div>
                              : null }

                            { successMsg
                              ?
                              <div className="alert-success">{ successMsg[event.eventId] }</div>
                              : null}
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
                      <div style={{float : 'right'}}>
                        <small style={{display : 'block'}}><strong>creator:</strong> { event.creator[0].username }</small>
                        <small>({ event.creator[0].email })</small>
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
          : null }
        <ScrollUpButton />
      </div>
    );
  }
}
