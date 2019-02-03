import React, { Component } from 'react';

import { Switch, Route } from "react-router-dom";

import './App.css';
import Header from "./layout/Header";
import Home from './views/Home';
import LiveCam from './views/LiveCam';
import Settings from './views/Settings';

import './components/socket';

class App extends Component {

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
    </div>
    );
  }
}

export default App;
