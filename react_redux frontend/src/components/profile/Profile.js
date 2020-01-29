import React from 'react'
import PropTypes from 'prop-types';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import EditDetails from '../posts/EditDetails';
import MyButton from '../layout/MyButton';
import ProfileSkeleton from './ProfileSkeleton';

import Button from '@material-ui/core/Button';
import Paper  from '@material-ui/core/Paper';
import MuiLink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';

import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

import { logoutUser, uploadImage } from '../../redux/actions/userActions';

const styles = (theme) => ({
    ...theme.spreadIt,
    paper: {
        padding: 20,
    },
    profile: {
        '& .image-wrapper': {
            textAlign: 'center',
            position: 'relative',
            '& button': {
                position: 'absolute',
                top: '80%',
                left: '70%'
            }
        },
        '& .profile-image': {
            width: 200,
            height: 200,
            objectFit: 'cover',
            maxWidth: '100%',
            borderRadius: '50%'
        },
        '& .profile-details': {
            textAlign: 'center',
            '& span, svg': {
                verticalAlign: 'middle'
            },
            '& a': {
                color: theme.palette.primary.main
            }
        },
        '& hr': {
            border: 'none',
            margin: '0 0 10px 0',
        },
        '& svg.button': {
            '&:hover': {
                cursor: 'pointer'
            }
        }
    },
    buttons: {
        textAlign: 'center',
        '& a': {
            margin: '20px 10px'
        }
    }
});


const Profile = (props) => {
    const { 
        classes, 
        user: {
            credentials: {handle, createdAt, imageUrl, bio, website, location }, 
            loading,
            authenticated
        }
    } = props;

    const onImageChange = (event) => {
        const image = event.target.files[0];
        
        const formData = new FormData();
        formData.append('image', image, image.name);
        props.uploadImage(formData);
    };

    const onEditPic = () => {
        const fileInput = document.getElementById('imageFile');
        fileInput.click();
    };

    const onLogout = () => {
        props.logoutUser();
    };

    let profileMarkup = !loading ? (authenticated ? (
        <Paper className={classes.paper}>
            <div className={classes.profile}>
                <div className="image-wrapper">
                    <img src={imageUrl} alt="profile" className="profile-image"/>
                    <input type="file" id="imageFile" onChange={onImageChange}  hidden="hidden" />

                    <MyButton tip="Edit profile picture" onClick={onEditPic} btnClassName="button">
                        <EditIcon color="primary" />
                    </MyButton>
                </div>
                <hr />
                <div className="profile-details">
                    <MuiLink component={Link} to={`/users/${handle}`} color="primary" variant="h5">
                        @{handle}
                    </MuiLink>
                    <hr />
                    {bio && <Typography variant="body2">{bio}</Typography>}
                    <hr />
                    {location && (
                        <React.Fragment>
                            <LocationOn color="primary"/> <span>{location}</span>
                        </React.Fragment>
                    )}
                    <hr />
                    {website && (
                        <React.Fragment>
                            <LinkIcon color="primary" />
                            <a href={website} target="_blank" rel="noopener noreferrer">
                                {' '}{website}
                            </a>
                        </React.Fragment>
                    )}
                    <hr />
                    <CalendarToday color="primary"/>{' '}
                    <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
                </div>
                <MyButton tip="Logout" onClick={onLogout}>
                    <KeyboardReturn color="primary" />
                </MyButton>
                <EditDetails/>
            </div>
        </Paper>
    ) : (
        <Paper className={classes.paper}>
            <Typography variant="body2" align='center'>
                No profile found. Please login again
            </Typography>
            <div className={classes.buttons}>
                <Button variant='contained' color='primary' component={Link} to="/login">
                    Login
                </Button>
                <Button variant='contained' color='secondary' component={Link} to="/signup">
                    Signup
                </Button>
            </div>
        </Paper>
    )) : (
        <ProfileSkeleton />
    );

    return profileMarkup;
}

const mapStateToProps = state => ({
    user: state.user
});

const mapActionToProps = { logoutUser, uploadImage };

Profile.propTypes = {
    user: PropTypes.object.isRequired,
    classes: PropTypes.object.isRequired,
    logoutUser: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired
};

export default connect(mapStateToProps, mapActionToProps)(withStyles(styles)(Profile));