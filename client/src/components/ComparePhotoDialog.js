import React from 'react';

import pixelmatch from 'pixelmatch';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import Avatar from '@material-ui/core/Avatar';
import Toolbar from '@material-ui/core/Toolbar';
import green from '@material-ui/core/colors/green';
import LinkIcon from '@material-ui/icons/Link';
import IconButton from '@material-ui/core/IconButton';
import SaveIcon from '@material-ui/icons/Save';
import CompareIcon from '@material-ui/icons/Compare';

const styles = theme => ({
  card: {
    width: "100%",
    marginTop: 20,
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

class ComparePhotoDialog extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      scroll: 'paper', //[paper | body]
    };
  }

  handleClose = () => {
    this.props.onClose();
  };

  comparePhoto = () => {
    const {prevImage, currImage, width, height} = this.props;

    let img1 = this.tmpCanvas(prevImage).getImageData(0, 0, width, height);
    let img2 = this.tmpCanvas(currImage).getImageData(0, 0, width, height);

    const diffCtx = this.canvasCtx();
    const diff = diffCtx.createImageData(width, height);

    pixelmatch(img1.data, img2.data, diff.data, width, height, {threshold: 0.1});
    diffCtx.putImageData(diff, 0, 0);
  }

  savePhoto = img => {
    return () => {
      const fileName = (new Date()).toISOString() + '.png';
      const link = document.createElement("a");
      link.setAttribute("href", img);
      link.setAttribute("download", fileName);
      link.click();
    };
  }

  render() {
    const {width} = this.props;

    return (
      <Dialog
        open={this.props.open}
        onClose={this.handleClose}
        scroll={this.state.scroll}
        maxWidth={width >= 1024 ? 'xl' : 'lg'}
        aria-labelledby="scroll-dialog-title"
      >
        <DialogTitle id="scroll-dialog-title">Diff</DialogTitle>
        <DialogContent>
          <IconButton onClick={this.comparePhoto}>
            <CompareIcon />
          </IconButton>
          <div id="my-card"></div>
          {this._renderCard(this.props.currImage)}
          {this._renderCard(this.props.prevImage)}
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
            <Avatar className={classes.avatarLink}>
              <LinkIcon />
            </Avatar>
          }
          action={
            <Toolbar>
              <IconButton onClick={this.savePhoto(image)}>
                <SaveIcon />
              </IconButton>
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
    const {width, height} = this.props;

    var canvas = document.createElement('canvas');
    canvas.width  = width;
    canvas.height = height;

    var ctx = canvas.getContext('2d');

    var img = new Image();
    img.src = buffer;
    ctx.drawImage(img, 0, 0);

    return ctx;
  }

  canvasCtx = () => {
    const {width, height} = this.props;

    var canvas = document.createElement('canvas');
    canvas.id     = "CursorLayer";
    canvas.width  = width;
    canvas.height = height;
    canvas.style.zIndex      = 8;
    // canvas.style.position = "absolute";
    canvas.style.border      = "5px solid";
    canvas.style.borderColor = "green";

    var body = document.getElementById('my-card');
    body.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    return ctx;
  }

}

export default withStyles(styles)(ComparePhotoDialog);
