import { useEffect, useState } from 'react';
import { useDispatch } from "react-redux";

import { getNotifications, MarkAllasRead, markOneasRead } from '../../services/apiConstants/apiServices';
import { setNavState } from '../../reducers/NavStateReducer';
import Toaster from '../../utils/Toster/Toaster';

import { Badge, Box, Divider, IconButton, Popover, Tooltip, Typography } from '@mui/material';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import NotificationsIcon from '@mui/icons-material/Notifications';
import notificationStyles from "./notifications.module.css";

// ----------------------------------------------------------------------


export default function Notifications() {

  const style = {
    color: "black",
    cursor: "pointer",
  };

  const unReadStyle = {
    ...style,
    backgroundColor: "#c2dbff",
  };

  const readStyle = {
    ...style,
    backgroundColor: "#F1F1F1",
  };

  const dispatch = useDispatch();
  const [notificaitions, setnotificaitions] = useState([])
  const unreadCount = notificaitions.filter((item) => !item.isRead).length;
  const [open, setOpen] = useState(false);

  const handleOpen = (event) => {
    setOpen(event.currentTarget);
    dispatch(setNavState({ data: true }));
  };

  const handleClose = () => {
    setOpen(false);
    dispatch(setNavState({ data: false }));

  };

  const Notification = () => {
    getNotifications().then((res) => {
      setnotificaitions(res.data)
    }).catch((err) => {
      console.error(err);
    });
  }

  const allRead = () => {
    MarkAllasRead().then(() => {
      Notification();
      Toaster("All marked as read", 39, ["success"])
    }).catch((err) => {
      Toaster(err.response.data.message, 38, ["error"])
      console.log(err);
    })
  }

  const oneRead = (id) => {
    markOneasRead(id).then(() => {
      Notification()
    }).catch((err) => {
      console.error(err);
    })
  }

  useEffect(() => {
    Notification();
  }, []);

  const notificaionount = () => {

    if (unreadCount == 1) {
      return "You have " + unreadCount  + " unread message"
    }
    else if (unreadCount > 0) {
      return "You have " +  unreadCount  + " unread messages"
    }

  }


  return (
    <>
      <IconButton onClick={handleOpen} sx={{ width: 40, height: 40 }}>
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon style={{ color: open ? "tomato" : "lightskyblue" }} />
        </Badge>
      </IconButton>

      <Popover
        open={Boolean(open)}
        anchorEl={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            mt: 1.5,
            ml: 0.75,
            width: 500,
          },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', py: 2, px: 2.5 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1">Notifications</Typography>
            {notificaionount()}
          </Box>
          {unreadCount > 0 && (
            <Tooltip title=" Mark all as read">
              <IconButton color="primary" onClick={() => allRead()}>
                <DoneAllIcon />
              </IconButton>
            </Tooltip>
          )}

        </Box>

        <Divider sx={{ borderStyle: 'dashed' }} />
        <div className={notificationStyles.notificationsDiv} >
          {notificaitions?.length > 0
            && notificaitions?.map((row) => {
              return (
                <div
                  key={row?.id}
                  style={row?.isRead ? readStyle : unReadStyle}
                  onClick={() => oneRead(row?.id)}
                >
                  <p className={notificationStyles.noti} >
                    {/* <Avatar
                      alt="hi"
                      style={{ width: "23px", height: "23px" }}
                      src={row?.avatar}
                    /> */}
                    {row?.message}
                  </p>
                  <Divider sx={{ borderStyle: 'dashed' }} />

                </div>

              );
            })
          }
        </div>

        <Divider sx={{ borderStyle: 'dashed' }} />

        <Box sx={{ p: 1 }} />
      </Popover>

    </>
  );
}

// ----------------------------------------------------------------------