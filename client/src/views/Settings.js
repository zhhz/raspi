import React from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    paddingTop: theme.spacing.unit * 8,
  },
});

class Settings extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <div>Settings</div>
      </div>
    );
  }
}

export default withStyles(styles)(Settings);
