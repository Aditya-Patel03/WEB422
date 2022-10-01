/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Patel Aditya Dharmesh Student ID: 143595205 Date: 09/16/2022
*  Cyclic Link: https://slate-gray-moth-hat.cyclic.app/
********************************************************************************/ 

const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const path = require("path")
const cors = require("cors");
const MoviesDB = require("./modules/moviesDB.js");
const db = new MoviesDB();
const mongoose = require('mongoose')
const dotenv = require('dotenv').config()
const HTTP_PORT = process.env.PORT || 3000;
app.use(bodyparser.json());
app.use(cors());
app.use(express.json());

app.get("/", function (req, res) {
  res.json({message: "API Listening"});
});

db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

app.post("/api/movies", (req,res) => {
    db.addNewMovie(req.body).then(() => {res.status(201).json(`new film successfully added`);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});

app.get("/api/movies", (req,res) => {
    db.getAllMovies(req.query.page, req.query.perPage, req.query.title)
        .then((film) => {res.status(201).json(film);
        })
        .catch((err) => {
            res.status(500).json(err);
        });
});


app.get("/api/movies/:id", (req,res) => {
    db.getMovieById(req.params.id)
        .then((film) => {res.status(201).json(film);
        })
        .catch((err) => {res.status(500).json({message: "errors"});
        });
});


app.put("/api/movies/:id", (req,res) => {
    db.updateMovieById(req.body, req.params.id)
        .then(() => {res.status(201).json(`film ${req.body._id} successfully updated`);
        })
        .catch((err) => {res.status(500).json({message: "error detected"});
        });
});



app.delete("/api/movies/:id", (req,res) => {
    db.deleteMovieById(req.params.id)
        .then(() => { res.status(201).json(`film successfully deleted`);
        })
        .catch((err) => { res.status(204).json({message: "error detected"});
        }); 
});


