
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import DeleteIcon from '@mui/icons-material/Delete';
import { Pagination, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';

import { deleteDish, getDishes } from 'src/services/apiConstants/apiServices';


export default function Dishes() {
    const [open, setOpen] = useState(false);
    const [details, setDetails] = useState([])
    const [searchParams] = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');

    const query = searchParams.get('mange');
    const id = query;

    useEffect(() => {
        const accessToken = localStorage.getItem("AccessToken");
        // let decodedToken = jwt_decode(accessToken);
        // console.log("qq", decodedToken);
        fetchDishes();
    }, [])
    useEffect(() => {
        fetchDishes(currentPage, searchTerm); // Pass the searchTerm here
    }, [currentPage, searchTerm]);
    const deleteDishh = async (id) => {

        const res = await deleteDish(id);

        if (res.status === 200) {
            fetchDishes()
        }
    }
    const handlePageChange = (event, newPage) => {
        setCurrentPage(newPage);
    };
    const fetchDishes = async (page, searchTerm) => {
        try {
            //   setLoading(true)
            const response = await getDishes(page, searchTerm);
            if (response.status === 200) {
                // setLoading(false)
            }
            console.log("qq", response);
            setDetails(response.data.shops);
            setTotalPages(response.data.totalPages);
            //   setLoading(false); // Set loading to false when the response is received
        } catch (error) {
            //   setLoading(false)
            //   setLoading(false); // Also set loading to false in case of an error
        }
    };


    return (
        <>
            <div>
                <TextField
                    label="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    variant="outlined"
                    sx={{ mb: 2 }}
                />
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell align="center">ID</TableCell>
                            <TableCell align="center">Dish Name</TableCell>
                            <TableCell align="center">Discription</TableCell>
                            <TableCell align="center">Price</TableCell>
                            <TableCell align="center">Dish Quantity</TableCell>
                            <TableCell align="center">Offer Status</TableCell>
                            <TableCell align="center">Status</TableCell>
                            <TableCell align="center">Category</TableCell>
                            <TableCell align="center">Trending</TableCell>
                            <TableCell align="center">Master Dishname</TableCell>
                            <TableCell align="center">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {details.length === 0 ? ( // Check if filteredData is empty
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span>No data found</span>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ) : (
                            details.map((row) => (
                                <TableRow key={row.id} sx={{ '&:last-child td, &:last-child th': { border: 0 } }} >
                                    <TableCell align="center">{row.id}</TableCell>
                                    <TableCell align="center">{row.dishName}</TableCell>
                                    <TableCell align="center">{row.discription}</TableCell>
                                    <TableCell align="center">{row.price}</TableCell>
                                    <TableCell align="center">{row.dishQuantity}</TableCell>
                                    <TableCell align="center">{row.offerStatus}</TableCell>
                                    <TableCell align="center">{row.status}</TableCell>
                                    <TableCell align="center">{row.categoryStatus}</TableCell>
                                    <TableCell align="center">{row.trending}</TableCell>
                                    <TableCell align="center">{row.masterdish.masterDishName}</TableCell>
                                    <TableCell align="center">
                                        <DeleteIcon style={{ color: 'grey', marginLeft: '1rem', cursor: 'pointer' }} onClick={() => deleteDishh(row.id)} />

                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>

            </TableContainer>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '20px' }}>
                <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                    shape="rounded"
                />
            </div>


        </>
    )
}