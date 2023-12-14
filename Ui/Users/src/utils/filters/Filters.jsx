/* eslint-disable react/prop-types */
import { useState } from 'react';
import PropTypes from 'prop-types';
import {
    Box,
    Button,
    Divider,
    FormControl,
    FormControlLabel,
    IconButton,
    Modal,
    Radio,
    RadioGroup,
    Slider,
    Tab,
    Tabs,
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import filterStyles from './filters.module.css';


function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
            style={{ width: '80%' }}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
};

function a11yProps(index) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

const initialFilterState = { category: '', trending: '', price: { min: '', max: '' }, offers: '' };

export default function Filters({ handleSubmitProps }) {
    const [value, setValue] = useState(0);
    const [open, setOpen] = useState(false);
    const [filter, setFilter] = useState(initialFilterState);

    const handleOpen = () => setOpen(true);
    const handleClose = () => { setOpen(false); };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleFilterChange = (event) => {
        setFilter({ ...filter, category: event.target.value });
    };

    const handleChangeTrending = (e) => {
        setFilter({ ...filter, trending: e.target.value })
    }

    const handleChangeOffers = (e) => {
        setFilter({ ...filter, offers: e.target.value })
    }

    const handleChangeSlider = (event, newValue) => {
        const [minValue, maxValue] = newValue;
        setFilter({ ...filter, price: { min: minValue, max: maxValue } });
    };

    const handleChangeSubmit = () => {
        handleSubmitProps(filter);
        handleClose();
    };

    const handleClear = () => {
        handleSubmitProps(''); // Send initial state instead of clearFilter
        setFilter(initialFilterState)
        handleClose();
    };

    return (
        <>
            <Button
                variant="contained"
                onClick={handleOpen}
                className={filterStyles.filterButton}
            >
                <img src='/assets/filter.png' alt="filter icon"
                    style={{
                        width: '10px',
                        height: '10px'
                    }} />
                Filters
            </Button>
            <Modal
                open={open}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box className={filterStyles.modalStyles}>
                    <div className={filterStyles.modalHeader}>
                        <Typography id="modal-modal-title" variant="h6" component="h2"
                            sx={{
                                color: 'rgb(28, 28, 28)',
                                margin: '0px',
                                fontSize: ' 1.7rem',
                                lineHeight: '3.2rem',
                                fontWeight: 500
                            }}
                        >
                            Filters
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
                            <Tabs
                                orientation="vertical"
                                variant="scrollable"
                                value={value}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                            >
                                <Tab label="Catogery" {...a11yProps(0)} />
                                <Tab label="Trending" {...a11yProps(1)} />
                                <Tab label="Price" {...a11yProps(2)} sx={{ wordBreak: 'break-word' }} />
                                <Tab label="Offers" {...a11yProps(3)} />
                            </Tabs>


                            <TabPanel value={value} index={0}>
                                <Typography variant='h6'>Catogery</Typography>
                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={filter.category}
                                        onChange={handleFilterChange}
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label=" Non veg" />
                                        <FormControlLabel value="2" control={<Radio />} label="Veg" />
                                        <FormControlLabel value="3" control={<Radio />} label="Juice" />
                                        <FormControlLabel value="" control={<Radio />} label="All" />
                                    </RadioGroup>
                                </FormControl>

                            </TabPanel>


                            <TabPanel value={value} index={1}>
                                <Typography variant='h6'> Trending </Typography>

                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={filter.trending}
                                        onChange={handleChangeTrending}
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Trending" />
                                        <FormControlLabel value="" control={<Radio />} label="All" />
                                    </RadioGroup>
                                </FormControl>

                            </TabPanel>
                            <TabPanel value={value} index={2}>

                                <Typography variant='h6'>Price</Typography>

                                <Box sx={{ width: '90%', paddingTop: 10, paddingLeft: 5 }}>
                                    <Slider
                                        getAriaLabel={() => 'Price range'}
                                        value={[filter.price.min, filter.price.max]}
                                        onChange={handleChangeSlider}
                                        valueLabelDisplay="on"
                                        step={100}
                                        marks
                                        max={2000}
                                        min={0} />
                                </Box>
                            </TabPanel>



                            <TabPanel value={value} index={3}>
                                <Typography variant='h6'> Offers</Typography>

                                <FormControl>
                                    <RadioGroup
                                        aria-labelledby="demo-radio-buttons-group-label"
                                        value={filter.offers}
                                        onChange={handleChangeOffers}
                                        name="radio-buttons-group"
                                    >
                                        <FormControlLabel value="1" control={<Radio />} label="Offers available" />
                                        <FormControlLabel value="" control={<Radio />} label="All" />
                                    </RadioGroup>
                                </FormControl>

                            </TabPanel>
                        </Box>
                    </div>

                    <Divider sx={{ borderStyle: 'solid' }} />

                    <div className={filterStyles.modalFooter}>
                        <Button variant='outlined' onClick={() => handleClear()}
                            sx={{
                                textTransform: 'none',
                                color: 'rgb(79, 79, 79)',
                                border: '1px solid rgb(207, 207, 207)',
                                boxShadow: 'rgb(54 54 54 / 6%) 0px 1px 2px',
                                borderRadius: '0.5rem',
                            }}>
                            Clear all
                        </Button>
                        <Button onClick={() => handleChangeSubmit()}
                            sx={{
                                background: 'rgb(239, 79, 95)',
                                color: 'black',
                                textTransform: 'none',
                                fontWeight: 800,
                            }}>
                            Apply
                        </Button>
                    </div>
                </Box>
            </Modal>
        </>

    )
}

Filters.propTypes = {
    handleSubmitProps: PropTypes.func
}







