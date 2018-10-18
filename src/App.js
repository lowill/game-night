import React, { Component } from 'react';

import TimeSheet from './scheduler/TimeSheet.js';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <TimeSheet/>
      </div>
    );
  }
}

export default App;
