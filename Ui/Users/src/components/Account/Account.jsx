import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { setNavState } from "../../reducers/NavStateReducer";
import { currentUser } from "../../services/apiConstants/apiServices";


import { Avatar, Box, Button, Divider, IconButton, MenuItem, Popover, Typography, } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { alpha } from "@mui/material/styles";



export default function Account() {

    const [data, setData] = useState("");
    const [open, setOpen] = useState(null);
    const [copySuccess, setCopySuccess] = useState('');

    const textToCopy = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleOpen = (event) => {
        setOpen(event.currentTarget);
        dispatch(setNavState({ data: true }));
    };

    const handleClose = () => {
        setOpen(false);
        setCopySuccess('')
    };

    const copyToClipboard = () => {
        textToCopy.current.select();
        document.execCommand('copy');
        setCopySuccess('Copied!');
    };

    const navigateTo = (id) => {
        setOpen(false);
        setCopySuccess('')
        if (id == 1) {
            navigate("/dashboard/profile");
        }
        else if (id == 2) {
            navigate("/dashboard/orderHistory")
        }
    };

    const userDetails = () => {
        currentUser().then((response) => {
            setData(response.data.user)
        }).catch((error) => {
            console.error(error);
        })
    }

    const logout = async () => {
        try {
            localStorage.clear();
            navigate("/");
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        userDetails()
    }, [])


    return (
        <>
            <IconButton
                onClick={handleOpen}
                sx={{
                    p: 0,
                    ...(open && {
                        "&:before": {
                            zIndex: 1,
                            content: "''",
                            width: "100%",
                            height: "100%",
                            borderRadius: "50%",
                            position: "absolute",
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.8),
                        },
                    }),
                }}
            >
                <Avatar
                    // src={data?.profileImage}
                    src="https://images.unsplash.com/photo-1511367461989-f85a21fda167?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cHJvZmlsZXxlbnwwfHwwfHx8MA%3D%3D&w=1000&q=80"
                    alt={data?.userName}
                />
            </IconButton>

            <Popover
                open={open}
                anchorEl={open}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                PaperProps={{
                    sx: {
                        mt: 1.5,
                        ml: 0.75,
                        width: 250,
                    },
                }}
            >
                <Box sx={{ my: 1.5, px: 2.5 }}>
                    <Typography variant="subtitle2" noWrap>
                        {data?.userName}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "text.secondary" }} noWrap>
                        {data?.email}
                    </Typography>
                </Box>
                <Divider sx={{ borderStyle: "dashed" }} />

                <MenuItem
                    sx={{ m: 1 }}
                    onClick={() => {
                        navigateTo(1);
                    }}
                    title="View Profile"
                >
                    <div> Profile</div>
                </MenuItem>

                {data?.refferalCode && (
                    <>
                        <Divider sx={{ borderStyle: "dashed" }} />
                        <MenuItem sx={{ m: 1 }}>

                            <form>
                                <input
                                    type="text"
                                    title="refferal code"
                                    style={{
                                        maxWidth: '150px',
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                    }}
                                    readOnly
                                    ref={textToCopy}
                                    value={data?.refferalCode}
                                />
                            </form>
                            <Button onClick={copyToClipboard} sx={{ textTransform: 'none' }}>
                                {copySuccess ? '🕵️‍♀️Copied!' : <ContentCopyIcon titleAccess="Click to copy refferalCode" />}
                            </Button>

                        </MenuItem>
                    </>
                )}

                <Divider sx={{ borderStyle: "dashed" }} />
                <MenuItem
                    sx={{ m: 1 }}
                    onClick={() => { navigateTo(2) }}
                    title="view orders"
                >
                    <div> Orders</div>

                </MenuItem>

                <Divider sx={{ borderStyle: "dashed" }} />

                <MenuItem onClick={logout}
                    sx={{ m: 1 }}
                    title="logout"
                >
                    <div> Logout</div>
                </MenuItem>
            </Popover>
        </>
    );
}
