import { useState, useRef } from 'react';
import { postGIftcards } from 'src/services/apiConstants/apiServices';

import AddIcon from '@mui/icons-material/Add';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';

import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css';


export default function GiftCards() {
    const init = useRef();
    const [open, setOpen] = useState(false);
    const [NameErr, setNameErr] = useState(null);
    const [descriptionErr, setDescriptionErr] = useState(null);
    const [discountErr, setdiscountErr] = useState(null);
    const [sDateErr, setsDateErr] = useState(null);
    const [eDateErr, seteDateErr] = useState(null);
    const [giftCard, setGiftCard] = useState({
        offerName: "",
        description: "",
        discount: "",
        startDate: "",
        endDate: ""
    });
    init.current = giftCard;
    const offerNameRef = useRef();
    const descriptionRef = useRef();
    const discountRef = useRef();
    const startDateRef = useRef();
    const endDateRef = useRef();

    const handleOpen = (id) => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setNameErr(null)
        setDescriptionErr(null)
        setdiscountErr(null)
        setsDateErr(null)
        seteDateErr(null)
        setGiftCard({
            offerName: "",
            description: "",
            discount: "",
            startDate: "",
            endDate: ""
        })
    };
    const handleKeyDown = (event) => {
        event.preventDefault(); // Prevent entering a date beyond the maximum
    };

    const validateAndSetError = (name, value, maxLength, setError) => {
        if (value === "") {
            setError(`${name} is required`);
        } else if (maxLength && value.length > maxLength) {
            setError(`Maximum ${name} length is ${maxLength}`);
        } else {
            setError(null);
        }
    };

    const onInputChange = (e) => {
        e.preventDefault();
        const { name, value } = e.target;
        setGiftCard({ ...giftCard, [name]: value });

        if (name === "offerName") {
            const nameCheck = /^[a-zA-Z]+(?: [a-zA-Z]+)*$/.test(value.trim());
            validateAndSetError("Offer Name", value, 30, setNameErr);
            if (!nameCheck) {
                setNameErr("Please Enter valid Offer Name");
            }
        } else if (name === "description") {
            validateAndSetError("Description", value, 100, setDescriptionErr);
        } else if (name === "discount") {
            validateAndSetError("Discount", value, null, setdiscountErr);
        } else if (name === "startDate" || name === "endDate") {
            validateAndSetError("Date", value, null, name === "startDate" ? setsDateErr : seteDateErr);
        }
    };



    const handleSubmit = () => {
        let flag = 0;

        if (giftCard.offerName.trim().length === 0) {
            setNameErr("Offer name is required");
            flag = 1;
            offerNameRef.current.focus();
        }
        if (giftCard.description.trim().length === 0) {
            setDescriptionErr("Description is required");
            flag = 1;
            descriptionRef.current.focus();
        }

        if (giftCard.discount === null || giftCard.discount === "") {
            setdiscountErr("Discount is required");
            flag = 1;
            discountRef.current.focus();
        }
        if (giftCard.startDate === null || giftCard.startDate === "") {
            setsDateErr("Start date is required");
            flag = 1;
            startDateRef.current.focus();
        }
        if (giftCard.endDate === null || giftCard.endDate === "") {
            seteDateErr("End date is required");
            flag = 1;
            endDateRef.current.focus();
        }
        if (giftCard.startDate > giftCard.endDate) {
            seteDateErr("End date must greater than start date");
            flag = 1;
        }

        if (NameErr || discountErr || discountErr || sDateErr || eDateErr) {
            return;
        }

        if (flag === 0) {
            postGIftcards(giftCard)
                .then((response) => {
                    toastr.success('Gift card added!', 'added', toastConfig);
                    console.log(response);
                    handleClose();
                })
                .catch((error) => {
                    toastr.error(error?.response?.data?.message, 'error', toastConfig);
                    console.error(error);
                });
        }
    };

    return (
        <div>
            <Button variant="outlined" startIcon={<AddIcon />} onClick={() => handleOpen()}>Giftcards</Button>

            <Dialog open={open} onClose={handleClose} disableBackdropClick>
                <DialogTitle>Add Gift Card Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        You can add gift cards from here
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="offerName"
                        name='offerName'
                        label="Offer name*"
                        type="text"
                        fullWidth
                        variant="standard"
                        ref={offerNameRef}
                        onChange={(e) => onInputChange(e)}
                    />
                    <span style={{ color: 'red' }}>{NameErr}</span>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="description"
                        name='description'
                        label="Description*"
                        type="text"
                        fullWidth
                        variant="standard"
                        ref={descriptionRef}
                        onChange={(e) => onInputChange(e)}
                    />
                    <span style={{ color: 'red' }}>{descriptionErr}</span>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="discount"
                        name='discount'
                        label="Discount*"
                        type="number"
                        fullWidth
                        variant="standard"
                        ref={discountRef}
                        onChange={(e) => onInputChange(e)}
                    />
                    <span style={{ color: 'red' }}>{discountErr}</span>
                    <TextField
                        margin="dense"
                        type="Date"
                        autoComplete="off"
                        id="s-date"
                        name="startDate"
                        fullWidth
                        variant="standard"
                        onKeyDown={handleKeyDown} // Prevent entering dates beyond the maximum
                        ref={startDateRef}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0], // Set the minimum date to today
                        }}
                        onChange={(e) => onInputChange(e)}
                    />
                    <span style={{ color: 'red' }}>{sDateErr}</span>
                    <TextField
                        margin="dense"
                        type="Date"
                        autoComplete="off"
                        id="e-date"
                        name="endDate"
                        fullWidth
                        variant="standard"
                        onKeyDown={handleKeyDown} // Prevent entering dates beyond the maximum
                        ref={endDateRef}
                        inputProps={{
                            min: new Date().toISOString().split('T')[0], // Set the minimum date to today
                        }}
                        onChange={(e) => onInputChange(e)}
                    />
                    <span style={{ color: 'red' }}>{eDateErr}</span>

                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} >Cancel</Button>
                    <Button onClick={() => { handleSubmit() }} >Proceed</Button>
                </DialogActions>
            </Dialog>

        </div>
    )
}

