/*********************************************************************************
*  WEB422 – Assignment 1
*  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  
*  No part of this assignment has been copied manually or electronically from any other source
*  (including web sites) or distributed to other students.
* 
*  Name: Nour Badiri Student ID: 108435215 Date: 09/07/2023
*  Cyclic Link: https://ill-ruby-whale-shoe.cyclic.app
*
********************************************************************************/ 
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
require('dotenv').config();
const config = process.env.connectionString;
const cors = require('cors');
const app = express();
const HTTP_PORT = process.env.PORT || 8080;
app.use(cors());
app.use(express.json());
const CompaniesDB = require("./modules/companiesDB.js");
const db = new CompaniesDB();


app.get('/', (req, res) => {
    res.json(({message: "This is a REST API"}));
});

//http service setup and db connection
db.initialize(process.env.MONGODB_CONN_STRING).then(()=>{
    app.listen(HTTP_PORT, ()=>{
        console.log(`server listening on: ${HTTP_PORT}`);
    });
}).catch((err)=>{
    console.log(err);
});

//add new company
app.post('/api/companies', (req, res) => {
    db.addNewCompany(req.body).then((data)=>{
        res.status(201).json(data);
    }).catch((err)=>{
        res.status(500).json(err);
    })
  });

// Get all companies
app.get("/api/companies", (req, res) => { // 
    let page = req.query.page ? req.query.page : 0;
  
    db.getAllCompanies(page,req.query.perPage,req.query.tag).then((data)=> {
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json(err);
    })
  });

// Get all companies
app.get("/api/company/:name", (req, res) => { // 
    db.getCompanyByName(req.params.name).then((data)=> {
        console.log("success to get a company");
        res.status(200).json(data);
      }).catch((err)=>{
          res.status(500).json(err);
      })
  
    });

//update a company
app.put("/api/company/:name", (req, res) => { // 
    db.updateCompanyByName(req.body, req.params.name).then((data)=> {
        res.status(200).json(data);
    }).catch((err)=>{
        res.status(500).json(err);
    })
  });

//delete a company by name
app.delete("/api/company/:name", (req,res) => {
    db.deleteCompanyByName(req.params.name).then((data) => {
      res.status(200).json(data);
    }).catch((err)=>{
      res.status(500).json(err);
    })
  });