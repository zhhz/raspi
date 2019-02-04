import React from 'react';

import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    paddingTop: theme.spacing.unit * 8,
  },
});

class Home extends React.Component {
  render() {
    const {classes} = this.props;

    return (
      <div className={classes.root}>
        <div>HOME1111</div>
      </div>
    );
  }
}

export default withStyles(styles)(Home);
