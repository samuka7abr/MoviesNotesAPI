require('express-async-errors');

const migrationsRun = require('./database/sqlite/migrations');
const AppError = require('./utils/AppError');
const routes = require('./routes');
const express = require('express');
const cors = require('cors');


migrationsRun();import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3333"
});

const app = express();
app.use(cors());
app.use(express.json())

app.use(routes)

app.use((error, request, response, next) => {
    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: 'error',
            message: error.message
        })
    }

    console.log(error);

    return response.status(500).json({
        status: 'error',
        message: 'Internal server error'
    })
})

const PORT = 3333;
app.listen(PORT, () => console.log(`Server is running in port: ${PORT}`));