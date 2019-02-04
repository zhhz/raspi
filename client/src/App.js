import React, { Component, Fragment } from 'react';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import Header from "./layout/Header";
import Home from './views/Home';
import LiveCam from './views/LiveCam';
import Settings from './views/Settings';


const styles = theme => ({
  root: {
    display: 'flex',
  },
});

class App extends Component {

  render() {
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <BrowserRouter>
          <Route
            path="/"
            render={({ location }) => (
              <Fragment>
                <Header location={location}/>
                <Switch>
                  <Route exact path="/" component={Home} />
                  <Route path="/livecam" component={LiveCam} />  
                  <Route path="/settings" component={Settings} />
                </Switch>
              </Fragment>
            )}
          />
        </BrowserRouter>
      </div>
    );
  }
}

export default withStyles(styles)(App);
