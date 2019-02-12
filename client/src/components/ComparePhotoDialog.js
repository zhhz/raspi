import React from 'react';

import pixelmatch from 'pixelmatch';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import green from '@material-ui/core/colors/green';
import CameraIcon from '@material-ui/icons/Camera';
import LinkIcon from '@material-ui/icons/Link';

import ProgressButton from './ProgressButton';

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
  avatarLink: {
    backgroundColor: green[500],
  },
});

class ScrollDialog extends React.Component {
  state = {
    scroll: 'paper', //[paper | body]
  };

  handleClose = () => {
    this.props.onClose();
  };

  comparePhoto = () => {
    const {prevImage, image} = this.state;

    let img1 = this.tmpCanvas(prevImage).getImageData(0, 0, 640, 480);
    let img2 = this.tmpCanvas(image).getImageData(0, 0, 640, 480);

    const diffCtx = this.canvasCtx();
    const diff = diffCtx.createImageData(640, 480);

    pixelmatch(img1.data, img2.data, diff.data, 640, 480, {threshold: 0.1});
    diffCtx.putImageData(diff, 0, 0);
  }

  render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        scroll={this.state.scroll}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {this._renderCard(this.props.currImage)}
            {this._renderCard(this.props.prevImage)}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  _renderCard(image) {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Connected" className={classes.avatarLink}>
              <LinkIcon />
            </Avatar>
          }
          action={
            <Toolbar>
              <ProgressButton
                handleClick={this.comparePhoto}
                icon={CameraIcon}
              />
            </Toolbar>
          }
          title="Compare Photo"
          subheader="subheader"
        />
        <CardMedia
          className={classes.media}
          component='img'
          src={image}
          title="preview"
        />
      </Card>
    );
  }

  tmpCanvas = buffer => {
    var canvas = document.createElement('canvas');
    canvas.width  = 640;
    canvas.height = 480;

    var ctx = canvas.getContext('2d');

    var img = new Image();
    img.src = buffer;
    ctx.drawImage(img, 0, 0);

    var body = document.getElementById('my-card');
    body.appendChild(canvas);

    return ctx;
  }

  canvasCtx = () => {
    var canvas = document.createElement('canvas');
    canvas.id     = "CursorLayer";
    canvas.width  = 640;
    canvas.height = 480;
    canvas.style.zIndex      = 8;
    // canvas.style.position    = "absolute";
    canvas.style.border      = "5px solid";
    canvas.style.borderColor = "green";

    var body = document.getElementById('my-card');
    body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    return ctx;
  }

}

export default withStyles(styles)(ScrollDialog);
