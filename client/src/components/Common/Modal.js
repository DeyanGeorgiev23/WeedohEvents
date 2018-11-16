import React from 'react';
import { Container, Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'mdbreact';

import Table from '../Common/Table';

class ModalPage extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      modal6: false,
      modal7: false

    };
  }

  toggle(nr) {
    let modalNumber = 'modal' + nr;
    this.setState({
      [modalNumber]: !this.state[modalNumber]
    });
  }

  render() {
    let { data } = this.props;

    return (
      <Container>
       <button className="btn btn-danger rouded-button" onClick={() => this.toggle(8)}>Participants</button>
        {/* <Button className="rouded-button" onClick={() => this.toggle(8)}>Participants</Button> */}
        <Modal isOpen={this.state.modal8} toggle={() => this.toggle(8)} fullHeight position="right">
          <ModalHeader toggle={() => this.toggle(8)}>Participants</ModalHeader>
          <ModalBody>
            <Table data={data}/>
          </ModalBody>
          <ModalFooter>
            <Button color="danger" onClick={() => this.toggle(8)}>Close</Button>
          </ModalFooter>
        </Modal>
      </Container>
    );
  }
}

export default ModalPage;