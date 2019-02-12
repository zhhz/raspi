import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/Camera';
import VideocamIcon from '@material-ui/icons/Videocam';

import { AppContext } from '../contexts/app-context';

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    paddingTop: theme.spacing.unit * 8,
  },
  container: {
    display: 'flex',
    flexWrap: 'wrap',
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
  },
  button: {
    margin: theme.spacing.unit,
  },
  icon: {
    marginRight: theme.spacing.unit,
  },
});

const CamPhotoLink = props => <Link to="/livecam/photo" {...props} />;
const CamVideoLink = props => <Link to="/livecam/video" {...props} />;

class Settings extends React.Component {

  handleChange = (name, updateContext) => event => {
    const value = event.target.value;
    updateContext(name, value);
  };

  render() {
    return (
      <AppContext.Consumer>
        { (appContext) => this._renderContent(appContext) }
      </AppContext.Consumer>
    );
  }

  _renderContent({camPhotoServer, camVideoServer, updateContext}) {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <form className={classes.container} noValidate autoComplete="off">
          <div>
            <TextField
              id="outlined-name"
              label="Cam Photo Server"
              className={classes.textField}
              value={camPhotoServer || '192.168.1.232:300'}
              onChange={this.handleChange('camPhotoServer', updateContext)}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button component={CamPhotoLink} variant="contained" color="primary" className={classes.button}>
              <CameraIcon className={classes.icon} />
              Go To Cam Photo
            </Button>
          </div>

          <div>
            <TextField
              id="outlined-full-width"
              label="Cam Video Server"
              className={classes.textField}
              placeholder="The Video Cam server"
              value={camVideoServer || 'localhost:3000'}
              onChange={this.handleChange('camVideoServer', updateContext)}
              margin="normal"
              variant="outlined"
              InputLabelProps={{
                shrink: true,
              }}
            />
            <Button component={CamVideoLink} variant="contained" color="primary" className={classes.button}>
              <VideocamIcon className={classes.icon} />
              Go To Cam Video
            </Button>
          </div>
      </form>
    </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
