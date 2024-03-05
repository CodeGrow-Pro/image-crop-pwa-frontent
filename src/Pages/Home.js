import { Save } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab'
import { Button, Divider, Grid, Paper, TextField, Typography } from '@mui/material'
import axios from 'axios';
import React, { useState } from 'react'
import { toast } from 'react-toastify';
import history from '../Components/history';
import { useNavigate } from 'react-router-dom';
import config from '../config';

export default function Home() {

  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState({})

  console.log("Errors", errors);
  
  const validateFields = () => {
    const errors = {}
    if(!email){
        errors["email"] = "Email cannot be blank"
    }
    if(!password){
        errors["password"] = "Password cannot be blank"
    }
    return errors;
  }

  const sendData = () => {

    const payload = {
      email: email,
      password: password
    }
    setLoader(true);
    axios.post(`${config.HOST}:${config.PORT}/api/users/login`, payload).then(({data}) => {
        setLoader(false);
        console.log(data);
        if(data.success){
            localStorage.setItem("token", data.token)
            localStorage.setItem("user", JSON.stringify(data.data))
            navigate("/reports")
        }
        else{
            toast.error(data.message)
        }
    }).catch((err) => {
        setLoader(false);
        toast.error(err.message || "Something went wrong")
    })
  }

  const handleSubmit = () => {
    const errors = validateFields();
    if(Object.keys(errors).length == 0){
        sendData();
    }
    setErrors(errors);
  }

  return (
    <Grid container>
        <Grid item sm={4} xs={12} md={4}></Grid>
        <Grid container item sm={4} xs={12} md={4} justifyContent={"center"} alignItems={"center"}>
          <Paper elevation={2} sx={{width: "80%", p: 3, mt: 4}}>
            <Grid container justifyContent={"center"} alignItems={"center"}>
              <Typography variant='h5'>Login</Typography>
            </Grid>
            <Grid container spacing={2} sx={{mt: 2}}>
              <Grid container item>
                <TextField 
                  label="Email"
                  size='small'
                  fullWidth
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                {
                  errors.email && 
                  <Typography variant='p' sx={{color: "red", fontSize: "12px"}}>{errors.email}</Typography>
                }
                
              </Grid>
              <Grid container item>
                <TextField 
                  label="Password"
                  size='small'
                  fullWidth
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                {
                    errors.password && 
                    <Typography variant='p' sx={{color: "red", fontSize: "12px"}}>{errors.password}</Typography>
                }
              </Grid>
            </Grid>
            <Grid container justifyContent={"center"} alignItems={"center"} sx={{mt: 2}}>
              <LoadingButton
                loading={loader}
                loadingPostition="start"
                variant="outlined"
                sx={{ml: 2}}
                onClick={handleSubmit}
            >
                Submit
            </LoadingButton>
            </Grid>
          </Paper>
        </Grid>
        
        
    </Grid>
  )
}
