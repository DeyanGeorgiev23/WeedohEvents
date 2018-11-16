import React from 'react';

import NoData from '../Common/NoData';

const InviteParticipants = props => {
  let { yourFriends, getFriendId } = props;
  return (
    <div>
     
      <div className="modal fade" id="centralModalSuccess" tabIndex="-1" role="dialog" aria-labelledby="myModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-notify modal-success" role="document">
   
          <div className="modal-content">
     
            <div className="modal-header">
              <p className="heading lead">Invite your friends</p>

              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true" className="white-text">&times;</span>
              </button>
            </div>

     
            <div className="modal-body">
              <div className="text-center">
                { yourFriends.length > 0 
                  ?
                  yourFriends.map(data => {
                    return (
                      <div id={ data.id } key={ data.id } className="pt-1">
                        <ul className="list-group shadow mb-1">
                          <li id={ data.id }  className="list-group-item d-flex justify-content-between align-items-center">
                            { data.username }  <small>{ data.email }</small>
                            <span onClick={ getFriendId } className="custom-badge badge badge-danger badge-pill">Invite</span>
                          </li>
                        </ul>
                      </div>
                    ); 
                  }) 
                
                  : 
                  <NoData data="There is no friends suggestions!"/>
                }
                
              </div>
            </div>

     
            <div className="modal-footer justify-content-center">
              <button type="button" className="btn btn-success waves-effect" data-dismiss="modal">Done</button>
            </div>
          </div>
   
        </div>
      </div>

      <div className="text-center">
        <button type="button" className="btn btn-default btn-rounded" data-toggle="modal" data-target="#centralModalSuccess">Invite <i className="fa fa-eye ml-1"></i></button>
      </div>
    </div>
  );
};

export default InviteParticipants;