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
        <form onSubmit={ (e) => this.createRoom(e) }>
          <label for="room">Create New Room</label>
          <input type="text" id="room" value={this.state.name} onChange={ (e) => this.handleChange(e) } />
          <button type="submit">Create Room</button>
        </form>
        <ul className="list-unstyled w-25">
          {this.state.rooms.map( (room) =>
            <div className="border">
              <li key={room.key} className="p-2" onClick={() => this.props.setActiveRoom(room)}>{room.name}</li>
            </div>
          )}
        </ul>
      </section>
    )
  }
}

export default RoomList;
