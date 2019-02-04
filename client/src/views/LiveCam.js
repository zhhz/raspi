import React from 'react';
import PropTypes from 'prop-types';

import { Switch, Route } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import VideocamIcon from '@material-ui/icons/Videocam';
import ImageSearchIcon from '@material-ui/icons/ImageSearch';

import { Link } from "react-router-dom";

import LiveCamPhoto from './LiveCamPhoto';
import LiveCamVideo from './LiveCamVideo';

const drawerWidth = 240;

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  toolbar: {
    display: 'block',
    minHeight: 48,
  },
});

function ClippedDrawer(props) {
  const { classes } = props;

  return (
    <div className={classes.root}>
      <Drawer
        className={classes.drawer}
        variant="permanent"
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <div className={classes.toolbar} />
        <List>
          <ListItem button component={Link} to="/livecam/photo" >
            <ListItemIcon><PhotoCameraIcon /></ListItemIcon>
            <ListItemText primary={"Photo"} />
          </ListItem>
          <ListItem button component={Link} to="/livecam/video" >
            <ListItemIcon><VideocamIcon /></ListItemIcon>
            <ListItemText primary={"Video"} />
          </ListItem>
        </List>
        <Divider />
        <List>
            <ListItem button>
              <ListItemIcon><ImageSearchIcon /></ListItemIcon>
              <ListItemText primary={"Misc"} />
            </ListItem>
        </List>
      </Drawer>
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/livecam/photo" component={LiveCamPhoto} />
          <Route exact path="/livecam/video" component={LiveCamVideo} />  
        </Switch>
      </main>
    </div>
  );
}

ClippedDrawer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ClippedDrawer);
