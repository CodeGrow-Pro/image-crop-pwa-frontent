import { Link, Navigate, Outlet, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Users from '../Pages/Users'
import Reports from '../Pages/Reports'
import history from './history'
import Home from '../Pages/Home'

const PrivateRoutes = () => {
    let token = localStorage.getItem("token");
    return (
        token ? <Outlet/> : <Navigate to="/" />
    )
}

function MyRoutes({children}) {
    return (
        <Router history={history}>
            {children}
            <Routes>
                <Route element={<PrivateRoutes />}>
                    <Route path='/reports' element={<Reports/>} exact />
                    <Route path='*' element={<Home/>} exact />
                </Route>
                <Route path='/' element={<Home />}></Route>
            </Routes>
        </Router>
    )
}

export default MyRoutes