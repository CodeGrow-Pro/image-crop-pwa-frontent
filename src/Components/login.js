import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../config';
import { toast } from 'react-toastify';
import { LoadingButton } from '@mui/lab';

const defaultTheme = createTheme();

export default function Login() {

    const navigate = useNavigate();
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [loader, setLoader] = React.useState(false);
    const [errors, setErrors] = React.useState({})

    console.log("Errors", errors);

    const validateFields = () => {
        const errors = {}
        if (!email) {
            errors["email"] = "Email is Required!"
        }
        if (!password) {
            errors["password"] = "Password is Required!"
        }
        return errors;
    }

    const sendData = () => {

        const payload = {
            email: email,
            password: password
        }
        setLoader(true);
        axios.post(`${config.HOST}:${config.PORT}/api/users/login`, payload).then(({ data }) => {
            setLoader(false);
            console.log(data);
            if (data.success) {
                localStorage.setItem("token", data.token)
                localStorage.setItem("user", JSON.stringify(data.data))
                navigate("/reports")
            }
            else {
                toast.error(data.message)
            }
        }).catch((err) => {
            setLoader(false);
            toast.error(err.message || "Something went wrong")
        })
    }

    const handleSubmit = () => {
        const errors = validateFields();
        if (Object.keys(errors).length == 0) {
            sendData();
        }
        setErrors(errors);
    }



    return (
        <ThemeProvider theme={defaultTheme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random?wallpapers)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'primary' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Login
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                autoComplete="email"
                                autoFocus
                            />
                            {
                                errors.email &&
                                <Typography variant='p' sx={{ color: "red", fontSize: "12px" }}>{errors.email}</Typography>
                            }
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                id="password"
                                autoComplete="current-password"
                            />
                            {
                                errors.password &&
                                <Typography variant='p' sx={{ color: "red", fontSize: "12px" }}>{errors.password}</Typography>
                            }
                            <LoadingButton
                                loading={loader}
                                loadingPostition="start"
                                variant="contained"
                                fullWidth
                                onClick={handleSubmit}
                            >
                                Login
                            </LoadingButton>
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}