import React from 'react';

import { withStyles } from '@material-ui/core/styles';

import ImageViewer from '../components/ImageViewer';
import { AppContext } from '../contexts/app-context';

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
      <AppContext.Consumer>
        {
          ({camPhotoServer}) => (
            <div className={classes.root}>
              <ImageViewer camPhotoServer={camPhotoServer} />
            </div>
          )
        }
      </AppContext.Consumer>
    );
  }
}

export default withStyles(styles)(LiveCamPhoto);
