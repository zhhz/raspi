import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import ImageViewer from '../components/ImageViewer';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
  },
});

class LiveCamPhoto extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <ImageViewer />
      </div>
    );
  }
}

export default withStyles(styles)(LiveCamPhoto);
