import { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import { NavLink } from 'react-router-dom';

import Notifications from '../notification/Notifications';
import UserRegister from '../../screens/Loginscreen/userRegister/UserRegister';
import Login from '../../screens/Loginscreen/login/Login';

import { Box, Divider, IconButton, Modal, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import navStyles from './Nav.module.css';
import Account from '../Account/Account';


export default function Nav() {
    const token = localStorage.getItem("accessToken");
    const [modalType, setModalType] = useState("login");
    const [isNavOpen, setIsNavOpen] = useState(false);
    const [open, setOpen] = useState(!token);
    const navState = useSelector((state) => state.navState);


    const toggleNav = () => {
        setIsNavOpen(!isNavOpen);
    };

    const handleOpen = (type) => {
        setOpen(true);
        setIsNavOpen(false);
        setModalType(type);
    };
    const handleClose = () => {
        setOpen(false);
    };


    const close = () => {
        setIsNavOpen(false);
    }

    const onSubmit = () => {
        setOpen(false)
    }
    useEffect(() => {
        if (navState) {
            setIsNavOpen(false);
        }
    }, [navState])

    return (

        <><nav>

            <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '30px', color: 'white', fontWeight: 600, fontSize: '20px', userSelect: 'none' }}>
                <NavLink to="/dashboard/home">Home</NavLink>
            </div>

            <div className={`${navStyles.hamburger} ${isNavOpen && navStyles.toggle}`} onClick={toggleNav}>
                <div className={navStyles.line1}></div>
                <div className={navStyles.line2}></div>
                <div className={navStyles.line3}></div>
            </div>
            <ul className={`${navStyles['nav-links']} ${isNavOpen && navStyles.open}`}>
                {token && <li><Notifications /></li>}
                <li><NavLink to="/dashboard/shops" onClick={() => close()}>Restaurants</NavLink></li>
                {/* <li><NavLink to="/dashboard/Dishes" onClick={() => close()}>Dishes</NavLink></li> */}
                {/* <li><NavLink to="#">Services</NavLink></li> */}
                {!token && (
                    <>
                        <li><button className={navStyles['login-button']} onClick={() => handleOpen("login")}>Login</button></li>
                        <li><button className={navStyles['join-button']} onClick={() => handleOpen("registration")}>Registration</button></li>
                    </>
                )}
                {token && <li><Account /></li>}

            </ul>
        </nav>

            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                sx={{
                    userSelect: 'none !important'
                }}
            >
                <Box className={navStyles.modalStyles}>
                    <div className={navStyles.modalHeader}>
                        <Typography
                            id="modal-modal-title"
                            variant="h6"
                            component="h2"
                            sx={{
                                color: 'rgb(28, 28, 28)',
                                margin: '0px',
                                fontSize: '1.7rem',
                                lineHeight: '3.2rem',
                                fontWeight: 500
                            }}
                        >
                            {modalType === "login" ? "Login" : "Registration"}
                        </Typography>
                        <IconButton onClick={handleClose} sx={{ cursor: 'pointer' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Divider sx={{ borderStyle: 'solid' }} />
                    <div style={{ wordBreak: 'break-word', }}>
                        {modalType === "login" ? <Login onSubmit={onSubmit} /> : <UserRegister onSubmit={onSubmit} />}
                    </div>
                </Box>
            </Modal>
        </>
    );
}


