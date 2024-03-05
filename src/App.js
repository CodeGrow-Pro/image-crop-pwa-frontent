import logo from './logo.svg';
import './App.css';
import { Grid } from '@mui/material';
import CustomAppBar from './Components/AppBar';
import MyRoutes from './Components/MyRoutes';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Grid>
      <MyRoutes>
        <CustomAppBar />
      </MyRoutes>
      <ToastContainer />

    </Grid>
  );
}

export default App;
