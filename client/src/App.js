import React, { Component } from 'react';

import { Switch, Route } from "react-router-dom";

import './App.css';
import Header from "./layout/Header";
import Home from './views/Home';
import LiveCam from './views/LiveCam';
import Settings from './views/Settings';

import socket from './components/socket';

class App extends Component {

  handleStart = () => {
    socket.emit('start-stream');
  }

  render() {
    return (
      <div className="App">
        <Header />
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/livecam" component={LiveCam} />  
          <Route path="/settings" component={Settings} />
        </Switch>
        <img id="stream" alt="stream"></img>
        <div id="infoMsg"></div>
        <button onClick={this.handleStart}>Start</button>
    </div>
    );
  }
}

export default App;
