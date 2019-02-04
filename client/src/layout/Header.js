import React from 'react';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';

import { Link } from "react-router-dom";

const styles = theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
});

class Header extends React.Component {

  render() {
    const { classes } = this.props;
    const path = this.props.location.pathname.split('/')[1];

    return (
        <AppBar position="fixed" className={classes.appBar}>
          <Tabs value={path}>
            <Tab value="" label="Home" component={Link} to="/" />
            <Tab value="livecam" label="Live Cam" component={Link} to="/livecam" />
            <Tab value="settings" label="Settings" component={Link} to="/settings" />
          </Tabs>
        </AppBar>
    );
  }
}

export default withStyles(styles)(Header);
