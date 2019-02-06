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
import CircularProgress from '@material-ui/core/CircularProgress';

import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';

import ShareIcon from '@material-ui/icons/Share';

import CameraIcon from '@material-ui/icons/Camera';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TvOffIcon from '@material-ui/icons/TvOff';
import LinkIcon from '@material-ui/icons/Link';
import LinkOffIcon from '@material-ui/icons/LinkOff';
import FavoriteIcon from '@material-ui/icons/Favorite';

import Socket from '../utils/socket';
import DateUtil from '../utils/date-time';

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
  progress: {
    margin: theme.spacing.unit * 2,
  },
});

class ImageViewer extends Component {
  state = {
    expanded: false,
    image: null,
    serverName: 'Not connected',
    connected: false,
    status: '',
  };

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  componentDidMount() {
    // this.socket = new Socket('http://localhost:3000') // localhost
    this.socket = new Socket('http://192.168.1.232:3000') // PI 3
    // this.socket = new Socket('http://192.168.1.233:3000') /// PI 0

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

  onPhotoReady = data => {
    this.setState({
      image: data,
      status:'success',
    });
  }

  takePhoto = () => {
    this.setState({
      status: 'taking-photo',
    });

    this.socket.takePhoto();
  }

  cancelPhoto = () => {
    this.setState({
      status: 'canceled',
    });

    this.socket.cancelPhoto();
  }

  render() {
    const { classes } = this.props;
    const { connected, status, serverName, ts } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Connected" className={connected ? classes.avatarLink : classes.avatarLinkOff}>
              {connected ? <LinkIcon /> : <LinkOffIcon />}
            </Avatar>
          }
          action={
            <Toolbar>
              <IconButton onClick={this.takePhoto} disabled={status === 'taking-photo'}>
                <CameraIcon />
              </IconButton>
              <IconButton onClick={this.cancelPhoto} disabled={status !== 'taking-photo'}>
                <TvOffIcon />
              </IconButton>
            </Toolbar>
          }
          title={serverName}
          subheader={ts}
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
    );
  }

  _getCardMedia() {
    const { classes } = this.props;
    const {status, image} = this.state;

    let media;
    switch(status) {
      case 'taking-photo':
        media = <CircularProgress className={classes.progress} size={40}/>;
        break;
      case 'success':
        media = <CardMedia
          className={classes.media}
          component='img'
          src={image}
          title="preview"
        />;
        break;
      case 'canceled':
        media = <CardContent>
          <Typography component="p"> Canceled </Typography>
        </CardContent>;
        break;
      default:
        media = <CardContent>
          <Typography component="p">Click on Camera icon to capture the photo</Typography>
        </CardContent>;
    }

    return media;
  }

  _getCardContent() {
    const {status} = this.state;
    return 'success' === status ? <Typography component="p">About this photo</Typography> : <Fragment />;
  }
}

ImageViewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageViewer);
