import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, Button, Card, CardContent, CircularProgress, Grid, IconButton, Typography } from '@mui/material';
import axios from 'axios';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import CreateReport from '../Components/CreateReport';
import config from '../config';
import moment from 'moment';


const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));


function createData(name, calories, fat, carbs, protein) {
    return { name, calories, fat, carbs, protein };
}

const rows = [
    createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
    createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
    createData('Eclair', 262, 16.0, 24, 6.0),
    createData('Cupcake', 305, 3.7, 67, 4.3),
    createData('Gingerbread', 356, 16.0, 49, 3.9),
];

function CustomizedTables({ rows }) {
    return (
        <div style={{ display: 'flex', flexDirection: 'row', flexFlow: 'wrap' }}>
            {rows.map((row) => (
                <Card key={row.name} sx={{ margin: '10px' }}>
                    <CardContent>
                        <Typography variant="h6">
                            Crop Name: {row?.crop?.name}
                        </Typography>
                        <Typography>
                            Description: {row?.result}
                        </Typography>
                        <Typography>
                            Created By: {row?.user?.name}
                        </Typography>
                        <Typography>
                            Created At: {moment(row?.createdAt).format("DD-MM-YYYY hh:mm:mm A")}
                        </Typography>
                        <Typography>
                            <br />
                            <a href={`${config.HOST}:${config.PORT}/${row.pdf_path}`} target='_blank'>
                                <Button variant='contained'>
                                    View Report
                                </Button>
                            </a>
                        </Typography>
                    </CardContent>
                </Card>
            ))}
            {rows.length === 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6">
                            Data Not Found
                        </Typography>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}


export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offline, setOffline] = useState(false);
    const navigate = useNavigate()
    const [open, setOpen] = useState(false);

    const onClose = () => {
        setOpen(false);
    }

    const getReports = () => {
        setLoader(true);
        axios.get(`${config.HOST}:${config.PORT}/api/reports`, {
            headers: {
                "authorization": localStorage.getItem("token")
            }
        }).then(({ data }) => {
            setLoader(false);
            setOffline(false);
            if (data.success) {
                setReports(data?.data?.reverse())
                localStorage.setItem("reports", JSON.stringify(data.data));
            }
        }).catch((err) => {
            setLoader(false);
            setOffline(true);
            let collection = localStorage.getItem("reports");
            setReports(JSON.parse(collection))
        })
    }

    useEffect(() => {
        getReports();
    }, [])

    return (
        <Grid>
            {
                loader
                    ?
                    <Grid container justifyContent={"center"} alignContent={"center"} sx={{ p: 2 }}>
                        <CircularProgress />
                    </Grid>
                    :
                    <Grid container sx={{ p: 3 }}>
                        {
                            offline &&
                            <Alert
                                severity="warning"
                                sx={{ width: "100%", p: 0, pl: 2, pr: 2 }}
                                action={
                                    <Button size='small' onClick={getReports}>Please Retry</Button>
                                }
                            >
                                🧐 The device is currently offline. 🧐
                            </Alert>
                        }
                        <Grid container justifyContent={"end"} alignContent={"center"} sx={{ mt: 1 }}>

                            <CreateReport
                                open={open}
                                onClose={onClose}
                                refreshContent={getReports}
                            />
                            <IconButton size='small' variant='outlined' onClick={getReports}><RestartAltIcon /></IconButton>
                            <Button size='small' variant='outlined' sx={{ ml: 2 }} onClick={() => setOpen(true)}>Create</Button>
                            <Button size='small' variant='outlined' sx={{ ml: 2 }} onClick={() => navigate('/')}>Logout</Button>
                        </Grid>
                        <Grid container sx={{ mt: 2 }}>
                            <CustomizedTables rows={reports} />
                        </Grid>

                    </Grid>
            }
        </Grid>
    )
}




