import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import TableContainer from '@mui/material/TableContainer';
import Paper from '@mui/material/Paper';
import { visuallyHidden } from '@mui/utils';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Typography from '@mui/material/Typography';
import { Button, Pagination, TextField } from '@mui/material';
import { getUsers, activate, deactivate } from 'src/services/AdminServices';
import Loader from '../../../utils/Loader/loader'
import toastConfig from '../../../utils/toastConfig'
import toastr from 'toastr';
import 'toastr/build/toastr.min.css'; // Import toastr CSS (optional, for styling)
import CircleIcon from '@mui/icons-material/Circle';
function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  { id: 'id', numeric: true, label: 'ID', disableSorting: true },
  { id: 'userName', numeric: false, label: 'User Name' },
  { id: 'email', numeric: false, label: 'E-Mail' },
  { id: 'registerType', numeric: false, label: 'Register Type' },
  { id: 'order_count', numeric: true, label: 'Order Count' },
  { id: 'ranking', numeric: true, label: 'User Ranking' },
  // { id: 'totalPoints', numeric: true, label: 'Points' },
  { id: 'status', numeric: false, label: 'User Status', type: 'status', disableSorting: true },
  { id: 'status', numeric: false, label: 'Action', type: 'action', disableSorting: true },

];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } = props;

  const createSortHandler = (property) => (event) => {
    onRequestSort(property);
  };


  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding="normal"
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.disableSorting ? (
              <Typography variant="subtitle2">{headCell.label}</Typography>
            ) : (
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={headCell.disableSorting ? null : createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  onRequestSort: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
};

export default function EnhancedTable() {
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('calories');
  const [details, setDetails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('')
  const [page] = useState(0);
  const [dense] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const activateUser = async (userId, status) => {
    try {
      setLoading(true)
      const currentUserId = userId; // Capture the current values in local variables
      // const currentStatus = status;

      const res = await activate(currentUserId);

      if (res.status === 200) {
        setTimeout(()=>{
          setLoading(false)

        },2200)
        toastr.success('User activated successfully!', 'Activated', toastConfig);
        const updatedDetails = details.map((user) =>
          user.id === currentUserId ? { ...user, status: '1' } : user
        );
        setDetails(updatedDetails);
      }else{
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)

      console.error('Error:', error);
    }
  };
  const deactivateUser = async (userId, status) => {
    try {
      setLoading(true)
      const currentUserId = userId; // Capture the current values in local variables
      // const currentStatus = status;

      const res = await deactivate(currentUserId);

      if (res.status === 200) {
        setTimeout(()=>{
          setLoading(false)

        },2200)
        toastr.error('User De-activated successfully!', 'De-Activated', toastConfig);

        // Update the user's status in the details state
        const updatedDetails = details.map((user) =>
          user.id === currentUserId ? { ...user, status: '0' } : user
        );
        setDetails(updatedDetails);
      }else{
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      console.error('Error:', error);
    }
  };
  const searchUser = (e) => {
    const searchUsers = e.target.value;
    setSearchTerm(searchUsers)
    setCurrentPage(1)
  }


  const fetchUsers = async (page, term) => {
    try {
      const data = await getUsers(page, term);
      setDetails(data.users);
      setCurrentPage(data.page);
      setTotalPages(data.totalPages);
      setLoading(false);
      return data;
    } catch (error) {


      throw error;
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, searchTerm)
      .then((data) => {
        console.log("Data", data);

      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, [currentPage, searchTerm]);

  const handlePageChange = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleRequestSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };



  const isSelected = (id) => false; // Change this logic according to your selection logic

  const emptyRows = Math.max(0);


  const visibleRows = stableSort(details, getComparator(order, orderBy)).slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <>
      <div>

        <h3 style={{ marginLeft: '.8rem', color: 'grey' }}>User Details </h3>
        {loading ? (
          <Loader />
        ) : (
          <>
            <TextField
              label="Search"
              value={searchTerm}
              onChange={searchUser}
              variant="outlined"
              sx={{ mb: 2 }}
            />

            <TableContainer component={Paper}>
              <Table
                sx={{ minWidth: 650 }} aria-label="simple table"
              >
                <EnhancedTableHead
                  order={order}
                  orderBy={orderBy}
                  onRequestSort={handleRequestSort}
                />
                <TableBody>
                  {details.length === 0 ? ( // Check if details array is empty
                    <TableRow>
                      <TableCell colSpan={headCells.length} align="center">
                        No data found
                      </TableCell>
                    </TableRow>
                  ) : (
                    visibleRows.map((row) => {
                      const isItemSelected = isSelected(row.id);

                      return (
                        <TableRow
                          hover
                          onClick={() => { }}
                          role="checkbox"
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.id}
                          selected={isItemSelected}
                          sx={{ cursor: 'pointer' }}
                        >
                          {headCells.map((headCell) => (
                            <TableCell
                              key={headCell.id}
                              align="center"
                              padding="normal"
                            >

                              { }

                              {headCell.type === 'status' ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                  {row[headCell.id] == '1' ? (
                                    <h4 style={{ color: 'green' }}>
                                      <CircleIcon />
                                    </h4>
                                  ) : row[headCell.id] == '0' ? (
                                    <h4 style={{ color: 'red' }}>
                                      <CircleIcon />
                                    </h4>
                                  ) : null}
                                </span>
                              ) :
                                headCell.type === 'action' ? (
                                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {row[headCell.id] == '1' ? (
                                      <Button
                                        variant="outlined"
                                        style={{ color: 'red', borderColor: 'red' }} onClick={() => deactivateUser(row.id, 'Active')}
                                      >
                                        De-Activate
                                      </Button>
                                    ) : row[headCell.id] == '0' ? (

                                      <Button
                                        variant="outlined"
                                        style={{ color: 'green', borderColor: 'green', minWidth: '6.95rem' }} onClick={() => activateUser(row.id, 'Active')}
                                      >
                                        Activate
                                      </Button>
                                    ) : null}
                                  </span>
                                ) : (
                                  row[headCell.id]
                                )}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  )}
                  {emptyRows > 0 && (
                    <TableRow
                      style={{
                        height: (dense ? 33 : 53) * emptyRows,
                      }}
                    >
                      <TableCell colSpan={9} />
                    </TableRow>
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
          </>)}

      </div>
    </>
  );
}