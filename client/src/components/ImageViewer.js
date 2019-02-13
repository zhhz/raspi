import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Collapse from '@material-ui/core/Collapse';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import ShareIcon from '@material-ui/icons/Share';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import StopIcon from '@material-ui/icons/NotInterested';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FavoriteIcon from '@material-ui/icons/Favorite';
import SaveIcon from '@material-ui/icons/Save';
import CameraIcon from '@material-ui/icons/Camera';
import CompareIcon from '@material-ui/icons/Compare';


import Socket from '../utils/socket';
import DateUtil from '../utils/date-time';
import ProgressButton from './ProgressButton';
import ComparePhotoDialog from './ComparePhotoDialog';
import storageFactory from '../utils/storage-factory';

const localStore = storageFactory();

const styles = theme => ({
  card: {
    width: "100%",
  },
  media: {
    // height: 0,
    // paddingTop: '56.25%', // 16:9
  },
  actions: {
    display: 'flex',
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatarLink: {
    backgroundColor: green[500],
  },
  avatarLinkOff: {
    backgroundColor: red[500],
  },
});

class ImageViewer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      expanded: false,
      prevImage: localStore.getItem('prevImage'),
      currImage: localStore.getItem('currImage'),
      count: 0,
      prevCount: 0,

      serverName: 'Not Connected',
      camPhotoServer: props.camPhotoServer || localStore.getItem('camPhotoServer'),
      connected: false,
      loading: false,
      success: false,
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  componentDidMount() {
    if(!this.state.camPhotoServer) return;

    this.socket = new Socket(this.state.camPhotoServer);
    // save to local store
    localStore.setItem('camPhotoServer', this.state.camPhotoServer);
    this.socket.init({
      onConnected: this.onConnected,
      onPhotoReady: this.onPhotoReady,
    });
  }

  onConnected = data => {
    this.setState({
      connected: true,
      serverName: data,
      ts: DateUtil.now(),
    });
  }

  onPhotoReady = image => {
    const {count, prevCount} = this.state;

    if(count === prevCount) return;

    const prevImage = this.state.currImage ? this.state.currImage : null;
    this.setState({
      prevImage,
      currImage: image,
      loading: false,
      success: true,
      prevCount: prevCount + 1,
    });

    localStore.setItem('prevImage', prevImage);
    localStore.setItem('currImage', image);
  }

  takePhoto = () => {
    this.setState({
      loading: true,
      success: false,
      count: this.state.count + 1,
    });

    this.socket.takePhoto();
  }

  cancelPhoto = () => {
    this.setState({
      loading: false,
      success: false,
    });

    this.socket.cancelPhoto();
  }

  savePhoto = () => {
    const fileName = (new Date()).toISOString() + '.png';
    const link = document.createElement("a");
    link.setAttribute("href", this.state.currImage);
    link.setAttribute("download", fileName);
    link.click();
  }

  comparePhoto = () => {
    this.setState({open: true});
  }

  handleClose = () => {
    this.setState({open: false});
  }

  render() {
    const { classes } = this.props;
    const { camPhotoServer, connected, loading, success, serverName, ts, prevImage } = this.state;

    return (
      <Fragment>
        <ComparePhotoDialog
          open={this.state.open}
          onClose={this.handleClose}
          prevImage={this.state.prevImage}
          currImage={this.state.currImage}
        />

        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Connected" className={connected ? classes.avatarLink : classes.avatarLinkOff}>
                {connected ? <LinkIcon /> : <LinkOffIcon />}
              </Avatar>
            }
            action={
              <Toolbar>
                <ProgressButton
                  handleClick={this.takePhoto}
                  icon={CameraIcon}
                  loading={loading}
                  success={success}
                  disabled={!connected}
                />
                <IconButton onClick={this.cancelPhoto} disabled={!loading}>
                  <StopIcon />
                </IconButton>
                <IconButton onClick={this.savePhoto} disabled={!success}>
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={this.comparePhoto} disabled={!prevImage}>
                  <CompareIcon />
                </IconButton>
              </Toolbar>
            }
            title={serverName}
            subheader={connected ? ts : camPhotoServer}
          />
          { this._getCardMedia() }
          <CardContent>
            { this._getCardContent() }
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="Add to favorites">
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            >
              <ExpandMoreIcon />
            </IconButton>
          </CardActions>
          <Collapse in={this.state.expanded} timeout="auto" unmountOnExit>
            <CardContent>
              <Typography paragraph>Method:</Typography>
              <Typography paragraph>
                Heat 1/2 cup of the broth in a pot until simmering, add saffron and set aside for 10
                minutes.
              </Typography>
              <Typography paragraph>
                Heat oil in a (14- to 16-inch) paella pan or a large, deep skillet over medium-high
                heat. Add chicken, shrimp and chorizo, and cook, stirring occasionally until lightly
              </Typography>
              <Typography paragraph>
                Add rice and stir very gently to distribute. Top with artichokes and peppers, and cook
              </Typography>
              <Typography>
                Set aside off of the heat to let rest for 10 minutes, and then serve.
              </Typography>
            </CardContent>
          </Collapse>
        </Card>
      </Fragment>
    );
  }

  _getCardMedia() {
    const { classes } = this.props;
    const {currImage, connected} = this.state;

    if(!connected) return <Fragment />

      if(!currImage && connected) {
        return  <CardContent>
          <Typography component="p">Click on Shutter icon to capture the photo</Typography>
        </CardContent>;
      }

    return  <CardMedia
      className={classes.media}
      component='img'
      src={currImage}
      title="preview"
    />;
  }

  _getCardContent() {
    const {camPhotoServer, connected, currImage} = this.state;

    if(!camPhotoServer) return <div>Please set the photo camera server in 'Settings' tab.</div>;
    if(camPhotoServer && !connected) return <div>Please confirm the photo camera server is online</div>;

    return currImage ? <Typography component="p">About this photo</Typography> : <Fragment />;
  }
}

ImageViewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageViewer);
