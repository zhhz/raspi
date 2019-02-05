import React from 'react';
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

import ShareIcon from '@material-ui/icons/Share';

import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloudIcon from '@material-ui/icons/Cloud';
import FavoriteIcon from '@material-ui/icons/Favorite';

import Socket from '../utils/socket';

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
  avatar: {
    backgroundColor: green[500],
  },
});

class ImageViewer extends React.Component {
  state = {
    expanded: false,
    image: '/images/disconnected.jpg',
    status: 'done',
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
    console.log(' =>  => connected: ', data);
  }

  onPhotoReady = data => {
    this.setState({
      image: data,
      status:'done',
    });
  }

  takePhoto = () => {
    this.setState({
      status: 'taking-photo',
    });

    this.socket.takePhoto();
  }

  render() {
    const { classes } = this.props;
    const { status, image } = this.state;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Connected" className={classes.avatar}>
              <CloudIcon />
            </Avatar>
          }
          action={
            <Toolbar>
              <IconButton onClick={this.takePhoto} disabled={status === 'taking-photo'}>
                <PhotoCameraIcon />
              </IconButton>
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            </Toolbar>
          }
          title="Connected to server"
          subheader="September 14, 2016"
        />
        {
          status === 'taking-photo' ?
            <CircularProgress />
            : <CardMedia
              className={classes.media}
              component='img'
              src={image}
              title="preview"
            />
        }
        <CardContent>
          <Typography component="p">
            Click to capture the photo
          </Typography>
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
}

ImageViewer.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(ImageViewer);
