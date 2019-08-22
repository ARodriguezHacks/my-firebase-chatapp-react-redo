import React, { Component } from 'react';

class EditRoomForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      roomName: this.props.roomToEdit
      //roomBeingEdited: true
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }
/*
  componentWillUpdate() {
    this.roomsRef.on('child_changed', snapshot => {
      const roomToChange = snapshot.val();
      roomToChange.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.splice(roomToChange.key, 1, this.state.roomName )})
    })
  }
*/
  handleRoomChange(e) {
    e.preventDefault();
    this.setState({
      roomName: e.target.value
    });
    //this.roomsRef.child(this.props.editRoomKey).update({name: this.state.roomName});
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

  render() {
    return (
      <input type="text" id="editRoom" value={this.state.roomName} onChange={ (e) => this.handleRoomChange(e) } />
    )
  }
}

export default EditRoomForm;