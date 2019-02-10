import React, { Component, Fragment } from 'react';

import { BrowserRouter, Switch, Route } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';

import Header from "./layout/Header";
import Home from './views/Home';
import LiveCam from './views/LiveCam';
import Settings from './views/Settings';
import { AppContext } from './contexts/app-context';


const styles = theme => ({
  root: {
    display: 'flex',
  },
});

class App extends Component {
  constructor(props) {
    super(props);

    this.updateContext = (name, value) => {
      this.setState({
        [name]: value,
      })
    }

    this.state = {
      updateContext:  this.updateContext,
      camPhotoServer: null,
      camVideoServer: null,
    }
  }

  render() {
    const { classes } = this.props;
    return (
      <AppContext.Provider value={this.state}>
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
      </AppContext.Provider>
    );
  }
}

export default withStyles(styles)(App);
