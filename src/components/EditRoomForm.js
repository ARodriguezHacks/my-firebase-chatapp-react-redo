import React, { Component } from 'react';

class EditRoomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: this.props.roomToEdit,
      roomBeingEdited: true
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }


  handleRoomChange(e) {
    e.preventDefault();
    this.setState({
      roomName: e.target.value
    });
  }
/*
  handleSave(e) {
    e.preventDefault();
    this.roomsRef.child(this.state.activeRoom.key).update({name: this.state.value});
    this.setState({
      activeRoom: this.state.value,
      editingRoom: false,
      value: ''
    });
    console.log(this.state.value);
  }
*/
  updateRoom(e) {
    e.preventDefault();
    this.roomsRef.child(this.props.editRoomKey).update({name: this.state.roomName});
    this.setState({
      roomName: this.state.roomName,
      roomBeingEdited: false
    });
  }

  cancelSave(e) {
    e.preventDefault();
    this.setState({
      roomBeingEdited: false
    });
  }

  render() {
    return (
      <form onSubmit={ (e) => this.updateRoom(e) }>
        <input type="text" id="editRoom" value={this.state.roomName} onChange={ (e) => this.handleRoomChange(e) } />
        <button type="submit">Save</button>
        <button type="submit" onClick={(e) => this.cancelSave(e)}>Cancel</button>
      </form>
    )
  }
}

export default EditRoomForm;