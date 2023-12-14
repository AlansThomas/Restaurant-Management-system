import { useEffect, useState } from 'react';
import { deleteGIftcards, getGIftcards } from 'src/services/apiConstants/apiServices';
import GiftCards from './GiftCards';

import DeleteIcon from '@mui/icons-material/Delete';
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import toastr from 'toastr';
import 'toastr/build/toastr.min.css';
import toastConfig from '../../../utils/toastConfig';



export default function Offers() {
    const [details, setDetails] = useState()



    const giftCards = () => {
        getGIftcards().then((res) => {
         
            setDetails(res?.data?.giftCards);

        }).catch((err) => {
            console.error(err);
        })
    }

    const deleteOffer = (id) => {

        deleteGIftcards(id).then((res) => {
            toastr.success('Gift card deleted!', 'deleted', toastConfig);

            giftCards();
        }).catch((err) => {

            toastr.error(err?.response?.data?.message, 'error', toastConfig);
        })

    }





    const getShopStatusInfo = (status) => {
        let statusText, statusColor;

        switch (status) {
            case 0:
                statusText = "Inactive";
                statusColor = "red";
                break;
            case 1:
                statusText = "Active";
                statusColor = "green";
                break;
            default:
                statusText = "Unknown";
                statusColor = "black";
        }

        return { statusText, statusColor }; // Return the status info
    };


    useEffect(() => {
        giftCards();
    }, [])

    return (
        <div style={{ display: 'flex', flexDirection: 'column', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingBottom: '10px', }}>
                <GiftCards  />
            </div>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">Gift card</TableCell>
                            <TableCell align="center">Description</TableCell>
                            <TableCell align="center">Discount</TableCell>
                            <TableCell align="center">Start date</TableCell>
                            <TableCell align="center">End date</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>

                        {details?.length > 0 ? details?.map((data) => (
                            <TableRow key={(data?.id)} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                                <TableCell align="center">{data?.offerName}</TableCell>
                                <TableCell align="center">{data?.description} </TableCell>
                                <TableCell align="center"> {data?.discount}</TableCell>
                                <TableCell align="center"> {data?.startDate}</TableCell>
                                <TableCell align="center"> {data?.endDate}</TableCell>
                                {(() => {
                                    const { statusText, statusColor } = getShopStatusInfo(data?.status);
                                    return (
                                        <TableCell align="center" style={{ color: statusColor }}>{statusText}</TableCell>
                                    );
                                })()}
                                <TableCell align="center">
                                    <DeleteIcon style={{ color: 'grey', cursor: 'pointer', marginLeft: '20px' }} onClick={() => deleteOffer(data?.id)} />
                                </TableCell>
                            </TableRow>
                        ))
                            : <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span>No data found</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

