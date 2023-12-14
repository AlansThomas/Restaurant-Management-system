import { useState, useEffect } from "react"

import { getGiftCards } from "../../../services/apiConstants/apiServices"

import { Box, Button, Divider, IconButton, Modal, Typography } from "@mui/material"
import CloseIcon from '@mui/icons-material/Close';
import offerStyles from './Offers.module.css'





function Offers() {

    const [gift, setgift] = useState([])
    const [open, setOpen] = useState(false);


    const handleOpen = () => setOpen(true);

    const handleClose = () => { setOpen(false); };

    const GiftCrds = () => {
        getGiftCards().then((response) => {
            console.log(response.data.giftCards);
            setgift(response?.data.giftCards)
        }).catch((error) => {
            console.error(error);
        })
    }

    useEffect(() => {
        GiftCrds()
    }, [])

    return (

        <><Typography variant='h5' sx={{
            color: 'rgb(58, 183, 87)',
            textTransform: 'none',
            fontSize: '1rem',
            padding: '10px'
        }}
        >
            Offers avilable
        </Typography>
            <div className={offerStyles.main}>
                {localStorage.getItem('profile') &&
                    <div className={offerStyles.offers}>
                        <div className={offerStyles.welcomeOffer}>
                            <Typography className={offerStyles.offerText}>
                                Get 20% OFF <br /> on your first meal
                            </Typography>
                        </div>
                    </div>}
                {gift?.map((row) => (
                    <div key={row?.id} className={offerStyles.offers}>
                        <div className={offerStyles.welcomeOffer}>
                            <Typography className={offerStyles.offerText}>
                                {row.offerName}  <br /> Get {row.discount} OFF
                            </Typography>
                        </div>
                    </div>

                ))}
            </div>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={offerStyles.modalStyles}>
                    <div className={offerStyles.modalHeader}>
                        <Typography id="modal-modal-title" variant="h6" component="h2"
                            sx={{
                                color: 'rgb(28, 28, 28)',
                                margin: '0px',
                                fontSize: ' 1.7rem',
                                lineHeight: '3.2rem',
                                fontWeight: 500
                            }}
                        >
                            Offers
                        </Typography>
                        <IconButton onClick={handleClose}
                            sx={{ cursor: 'pointer' }}>
                            <CloseIcon />
                        </IconButton>
                    </div>
                    <Divider sx={{ borderStyle: 'solid' }} />


                    <div style={{ wordBreak: 'break-word' }}>
                        <Typography id="modal-modal-description" variant="body1" sx={{ pt: 2, pb: 2 }}>
                            Experience the ultimate taste with our food selection.
                        </Typography>


                        <Box
                            sx={{ flexGrow: 1, bgcolor: 'background.paper', display: 'flex', height: 'fit-content', minHeight: 400 }}
                        >


                        </Box>
                    </div>

                    <Divider sx={{ borderStyle: 'solid' }} />

                    <div className={offerStyles.modalFooter}>
                        <Button
                            sx={{
                                background: 'rgb(239, 79, 95)',
                                color: 'black',
                                textTransform: 'none',
                                fontWeight: 800,
                            }}>
                            Redeem
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>


    )
}

export default Offers