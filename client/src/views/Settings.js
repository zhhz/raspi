import React from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';

import { AppContext } from '../contexts/app-context';
import CamPhotoSettingCard from '../components/CamPhotoSettingCard';
import CamVideoSettingCard from '../components/CamVideoSettingCard';
import storageFactory from '../utils/storage-factory';

const localStore = storageFactory();

const styles = theme => ({
  root: {
    flexGrow: 1,
    display: 'flex',
    paddingTop: theme.spacing.unit * 8,
  },
});

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
        <CamPhotoSettingCard
          camPhotoServer={camPhotoServer || localStore.getItem('camPhotoServer')}
          updateContext={updateContext}
        />
        <CamVideoSettingCard
          camVideoServer={camVideoServer || localStore.getItem('camVideoServer')}
          updateContext={updateContext}
        />
    </div>
    );
  }
}

Settings.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Settings);
