import React, { Component } from 'react';
// import TimeSheet from './scheduler/TimeSheet.js';
import GamePicker from './picker/GamePicker.js';
import './App.css';

class App extends Component {
  render() {
    let content = null;

    // content = <TimeSheet/>
    content = <GamePicker />

    return(
      <div className="App">
        {content}
      </div>
    );
  }
}

export default App;
