import React, { useState } from 'react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import PropTypes from 'prop-types';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { markNotificationsRead } from '../../redux/actions/userActions';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';

import NotificationsIcon from '@material-ui/icons/Notifications';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ChatIcon from '@material-ui/icons/Chat';

const Notifications = (props) => {
    const [anchorEl, setAnchorEl] = useState(null);
    dayjs.extend(relativeTime);

    const onOpen = event => {
        setAnchorEl(event.target);
    }

    const onClose = () => {
        setAnchorEl(null);
    }

    const onMenuOpened = () => {
        let unreadNotificationIds = props.notifications
            .filter(notif => !notif.read)
            .map(notif => notif.notificationId);
        
        props.markNotificationsRead(unreadNotificationIds);
    }

    let notificationIcon;
    if (props.notifications && props.notifications.length > 0) {
        props.notifications.filter(not => not.read === false).length > 0
            ? notificationIcon = (
                <Badge badgeContent={props.notifications.filter(not => not.read === false).length}
                color="secondary">
                    <NotificationsIcon />
                </Badge>
            ) : (
                notificationIcon = <NotificationsIcon />
            )
    } else {
        notificationIcon = <NotificationsIcon />
    }
    

    let notificationsMarkup = props.notifications && props.notifications.length > 0 ? (
        props.notifications.map(notif => {
            const verb = notif.type === 'like' ? 'liked' : 'commented on';
            const time = dayjs(notif.createdAt).fromNow();
            const iconColor = notif.read ? 'primary' : 'secondary';
            const icon = notif.type === 'like' ? (
                <FavoriteIcon color={iconColor} style={{ marginRight: 10 }} />
            ) : (
                <ChatIcon color={iconColor} style={{ marginRight: 10 }} />
            )

            return (
                <MenuItem key={notif.createdAt} onClick={onClose}>
                    {icon}
                    <Typography
                        component={Link}
                        color="primary"
                        variant="body1"
                        to={`/users/${notif.recipient}/post/${notif.postId}`}
                        >
                        {notif.sender} {verb} your post {time}
                        </Typography>
                </MenuItem>
            );
        })
    ) : (
        <MenuItem onClick={onClose}>
            You have no notifications yet
        </MenuItem>
    );

    return (
        <React.Fragment>
            <Tooltip placement='top' title="Notifications">
                <IconButton aria-owns={anchorEl ? 'simple-menu' : undefined}
                    aria-haspopup="true"
                    onClick={onOpen} 
                >
                    {notificationIcon}
                </IconButton>
            </Tooltip>
            <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={onClose}
            onEntered={onMenuOpened}
            >
                {notificationsMarkup}
            </Menu>

        </React.Fragment>
    );
}


Notifications.propTypes = {
    markNotificationsRead: PropTypes.func.isRequired,
    notifications: PropTypes.array.isRequired
}

const mapStateToProps = state => ({
    notifications: state.user.notifications
});

export default connect(mapStateToProps, { markNotificationsRead })(Notifications);