import React, { Component } from 'react';

class RoomList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rooms: [],
      name: ''
    };

    this.roomsRef = this.props.firebase.database().ref('rooms');
  }

  componentDidMount() {
    this.roomsRef.on('child_added', snapshot => {
      const room = snapshot.val();
      room.key = snapshot.key;
      this.setState({ rooms: this.state.rooms.concat( room ) });
    });
  }

  handleChange(e) {
    e.preventDefault();
    this.setState({ name: e.target.value });
  }

  createRoom(e) {
    e.preventDefault();
    this.roomsRef.push({
      name: this.state.name
    });
    this.setState({ name: '' });
  }

  render() {
    return (
      <section>
        <ul>
          {this.state.rooms.map( (room) =>
            <li key={room.key} onClick={() => this.props.setActiveRoom(room)}>{room.name}</li>
          )}
        </ul>
        <form onSubmit={ (e) => this.createRoom(e) }>
          <label for="room">Create New Room</label>
          <input type="text" id="room" value={this.state.name} onChange={ (e) => this.handleChange(e) } />
          <button type="submit">Create Room</button>
        </form>
      </section>
    )
  }
}

export default RoomList;
