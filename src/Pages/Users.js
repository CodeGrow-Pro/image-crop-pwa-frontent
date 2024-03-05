import { Grid, Table, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function Users() {
    const [products, setProducts] = useState([]);
    const [mode, setMode] = useState("online");

    useEffect( () => {
        axios.get('https://dummyjson.com/products', {}).then(({data}) => {
            setProducts(data.products);
            localStorage.setItem("products", JSON.stringify(data.products));
        }).catch((err) => {
            let collection = localStorage.getItem("products");
            setMode("offline");
            setProducts(JSON.parse(collection))
        })
    }, [])

    return (
        <Grid>
            <Typography>Users</Typography>
            <input type='file' />
            {
                mode == "offline" && 
                <Typography>Device is offline</Typography>
            }
            <table>
                <thead>
                    <tr>
                        <td>Id</td>
                        <td>Title</td>
                    </tr>
                </thead>
                <tbody>
                    {
                        products.map((p, i) => {
                            return (
                                <tr key={i}>
                                    <td>{p.id}</td>
                                    <td>{p.title}</td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </Grid>
    )
}
