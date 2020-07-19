const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://mongodb:27017';
const nodemailer = require('nodemailer');
require('dotenv').config();

// Create Transporter for nodemailer
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
  });

const get_Dataset = (req, res) => {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('AI_Datasets');
    const collection = db.collection('datasets');

    collection.find({}).toArray((error, documents) => {
        client.close();
        documents.reverse();
        const datasetsVariables = {
            pageTitle: "First page of our app",
            datasets: documents
        }
        res.render('Datasets', { datasetsVariables: datasetsVariables });
      });
    });
  };

const upload_Dataset = (req, res) => {
    res.render("Upload_dataset");
  };

const post_Dataset = (req, res) => {
  const newDataset = {
    name: req.body.name,
    type: req.body.type,
    desc: req.body.description,
    authName: req.body.authorName,
    //uplDate: req.body.date,
    dataset: req.file.filename
}
  MongoClient.connect(url, function (err, client) {
    const db = client.db('AI_Datasets');
    const collection = db.collection('datasets');

    collection.insertOne(newDataset);

    let mailOptions = {
      from: '<<AdminEmail-1>>',
      to: '<<AdminEmail-2>>',
      subject: 'Notification from "The Next AI" Website - New Dataset',
      text: `A new Dataset is added to the collection by ${req.body.authorName}. The details are :
      1. Name : ${req.body.name}
      2. Type : ${req.body.type}
      3. Description ; ${req.body.description}`
  };

    transporter.sendMail(mailOptions, function(err, data){
        if(err) {
            console.log('Error Occurs !!!!!')
        } else {
            console.log('Email notification Sent to the Admin after a Dataset is Added!!');
        }
    });

    client.close();
    res.redirect('/Datasets');
  });
  };

const delete_Dataset = (req, res) => {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('AI_Datasets');
    const collection = db.collection('datasets');
    const idToDelete_dataset = req.params.id;

    collection.deleteOne({ "_id": ObjectID(idToDelete_dataset) });
    client.close();
    res.redirect('/Datasets');
  });
};

const download_Dataset = (req, res) => {
  MongoClient.connect(url, function (err, client) {
    const db = client.db('AI_Datasets');
    const collection = db.collection('datasets');
    const idToDownload_dataset = req.params.id;
    
    var myDocument = collection.find({ "_id": ObjectID(idToDownload_dataset) }).toArray((error, documents) => {
        const download_file = __dirname+'/../../public/img/users/'+ documents[0].dataset;
        res.download(download_file)
        client.close(); 
    });
  });
};

module.exports = {
    get: get_Dataset,
    upload: upload_Dataset,
    delete: delete_Dataset,
    download: download_Dataset,
    post: post_Dataset
};
