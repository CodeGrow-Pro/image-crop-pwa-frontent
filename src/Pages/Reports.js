import React, {useEffect, useState} from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Alert, Button, CircularProgress, Grid } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import CreateReport from '../Components/CreateReport';
import config from '../config';


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
  
function CustomizedTables({rows}) {
    return (
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Crop Name</StyledTableCell>
              <StyledTableCell>Result</StyledTableCell>
              <StyledTableCell>Submitted By</StyledTableCell>
              <StyledTableCell>Report</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
                rows.map((row) => (

                    <StyledTableRow key={row.name}>
                        <StyledTableCell component="th" scope="row">{row?.crop?.name}</StyledTableCell>
                        <StyledTableCell>{row?.result}</StyledTableCell>
                        <StyledTableCell>{row?.user?.name}</StyledTableCell>
                        <StyledTableCell>
                            <Link to={`${config.HOST}:${config.PORT}/${row.pdf_path}`} target='_blank'>Download Report</Link>
                        </StyledTableCell>
                    </StyledTableRow>
                ))
            }
            {
                rows.length == 0 &&
                (
                    <StyledTableRow>
                        <StyledTableCell component="th" scope="row" colSpan={100}>No Records Found</StyledTableCell>
                    </StyledTableRow>
                )
            }
          </TableBody>
        </Table>
      </TableContainer>
    );
}


export default function Reports() {
    const [reports, setReports] = useState([]);
    const [loader, setLoader] = useState(false);
    const [offline, setOffline] = useState(false);

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
        }).then(({data}) => {
            setLoader(false);
            setOffline(false);
            if(data.success){
                setReports(data.data)
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
                    <Grid container justifyContent={"center"} alignContent={"center"} sx={{p: 2}}>
                        <CircularProgress />
                    </Grid>
                :
                    <Grid container sx={{p: 3}}>
                        {
                            offline &&
                            <Alert
                                severity="error"
                                sx={{width: "100%", p: 0, pl: 2, pr: 2}}
                                action={
                                    <Button size='small' onClick={getReports}>RETRY</Button>
                                }
                            >
                                Device is in offline mode.
                            </Alert>
                        }
                        <Grid container justifyContent={"end"} alignContent={"center"} sx={{mt: 1}}>

                            <CreateReport 
                                open={open}
                                onClose={onClose}
                                refreshContent={getReports}
                            />
                            <Button size='small' variant='outlined' onClick={getReports}>Refresh Reports</Button>
                            <Button size='small' variant='outlined' sx={{ml: 2}} onClick={() => setOpen(true)}>Create Report</Button>
                        </Grid>
                        <Grid container justifyContent={"center"} alignContent={"end"} sx={{mt: 2}}>
                            <CustomizedTables rows={reports}/>
                        </Grid>
                        
                    </Grid>
            }
        </Grid>
    )
}




