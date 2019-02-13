import React from 'react';
import PropTypes from 'prop-types';

import { Link } from "react-router-dom";

import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import red from '@material-ui/core/colors/red';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CameraIcon from '@material-ui/icons/Camera';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';

const styles = theme => ({
  card: {
    maxWidth: 400,
    margin: 20,
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
    backgroundColor: red[500],
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

class RecipeReviewCard extends React.Component {

  handleChange = (name, updateContext) => event => {
    const value = event.target.value;
    updateContext(name, value);
  };

  render() {
    const { classes, camPhotoServer, updateContext } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar className={classes.avatar}>
              <PhotoCameraIcon />
            </Avatar>
          }
          title="Pi Photo Server Settings"
          subheader="all the info required"
        />
        <CardMedia
          className={classes.media}
          image="/static/images/cards/paella.jpg"
          title="Paella dish"
        />
        <CardContent>
          <form className={classes.container} noValidate autoComplete="off">
            <div>
              <TextField
                id="outlined-name"
                label="Cam Photo Server"
                className={classes.textField}
                value={camPhotoServer}
                onChange={this.handleChange('camPhotoServer', updateContext)}
                margin="normal"
                variant="outlined"
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
          </form>
          <Typography component="p">
            This impressive paella is a perfect party dish and a fun meal to cook together with your
            guests. Add 1 cup of frozen peas along with the mussels, if you like.
          </Typography>
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>
          <Button component={CamPhotoLink} variant="contained" color="primary" className={classes.button}>
            <CameraIcon className={classes.icon} />
            Go To Cam Photo
          </Button>
        </CardActions>
      </Card>
    );
  }
}

RecipeReviewCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(RecipeReviewCard);
