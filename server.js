/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Patel Aditya Dharmesh Student ID: 143595205 Date: 09/16/2022
*  Cyclic Link: https://slate-gray-moth-hat.cyclic.app/
********************************************************************************/ 
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const cors = require('cors')
const MoviesDB = require("./modules/moviesDB.js");
const { json } = require('express');
const db = new MoviesDB();
require('dotenv').config()

db.initialize(process.env.MONGODB_CONN_STRING).then(() => {
    app.listen(PORT, () => {
        console.log(`server listening on: ${PORT}`);
    })
}).catch((err) => {
    console.log(err);
});

app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
    res.json({ message: "API Listening" })
})

app.post('/api/movies', (req, res) => {
    if (Object.keys(req.body) === 0)
        res.status(500).json({ message: "missing body" })
    else
        db.addNewMovie(req.body)
            .then((data) => { res.status(200).json(data) })
            .cathch((err) => { res.status(500).json({ error: err.message }) })
})

app.get('/api/movies', (req, res) => {
    if (!req.query.page || !req.query.perPage)
        res.status(500).json({ message: "missing query page/perPage" })
    else {
        db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
            .then((data) => {
                if (data.length === 0) res.status(204).json({ message: "no data found" })
                else res.json(data)
            })
            .catch((err) => { res.status(500).json({ error: err.message }) })

    }
})

app.get('/api/movies/:_id', (req, res) => {
    db.getMovieById(req.params._id)
        .then((data) => {
            if (data.length === 0) res.status(204).json({ message: "no data found" })
            else res.json(data)
        })
        .catch((error) => { res.status(500).json({ error: err.message }) })
})

app.put('/api/movie', (req, res) => {
    if (Object.keys(req.body).length === 0) res.status(500).json({ message: "empty body" })
    else
        db.updateMovieById(req.body, req.params._id)
            .then(() => { res.status(201).json({ message: "update successfully" }) })
            .catch((err) => { res.status(500).json({ error: err.message }) })
})

app.delete('/api/movies', (req, res) => {
    db.deleteMovieById(req.params._id)
        .then(() => { res.status(201).json({ message: "data deleted" }) })
        .catch((err) => { res.status(500).json({ error: err.message }) })
})
// const express = require("express");
// const app = express();
// const bodyparser = require("body-parser");
// const path = require("path")
// const cors = require("cors");
// const MoviesDB = require("./modules/moviesDB.js");
// const db = new MoviesDB();
// const mongoose = require('mongoose')
// const dotenv = require('dotenv').config()
// const HTTP_PORT = process.env.PORT || 3000;
// app.use(bodyparser.json());
// app.use(cors());
// app.use(express.json());

// app.get("/", function (req, res) {
//   res.json({message: "API Listening"});
// });

// db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
//     app.listen(HTTP_PORT, ()=>{
//         console.log(`server listening on: ${HTTP_PORT}`);
//     });
// }).catch((err)=>{
//     console.log(err);
// });

// app.post("/api/movies", (req,res) => {
//     db.addNewMovie(req.body).then(() => {res.status(201).json(`new film successfully added`);
//         })
//         .catch((err) => {
//             res.status(500).json(err);
//         });
// });

// app.get("/api/movies", (req,res) => {
//     db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
//         .then((film) => {res.status(201).json(film);
//         })
//         .catch((err) => {
//             res.status(500).json(err);
//         });
// });


// app.get("/api/movies/:id", (req,res) => {
//     db.getMovieById(req.params.id)
//         .then((film) => {res.status(201).json(film);
//         })
//         .catch((err) => {res.status(500).json({message: "errors"});
//         });
// });


// app.put("/api/movies/:id", (req,res) => {
//     db.updateMovieById(req.body, req.params.id)
//         .then(() => {res.status(201).json(`film ${req.body._id} successfully updated`);
//         })
//         .catch((err) => {res.status(500).json({message: "error detected"});
//         });
// });



app.delete("/api/movies/:id", (req,res) => {
    db.deleteMovieById(req.params.id)
        .then(() => { res.status(201).json(`film successfully deleted`);
        })
        .catch((err) => { res.status(204).json({message: "error detected"});
        }); 
});


