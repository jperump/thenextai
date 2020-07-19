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

const get_Users = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');

        collection.find({}).toArray((error, documents) => {
            client.close();
            documents.reverse();
            const indexVariables = {
                pageTitle: "First page of our app",
                users: documents
            }
            res.render('Users', { variables: indexVariables});
        });
    });
  };

const create_Users = (req, res) => {
    res.render('create');
  };

const post_Users = (req, res) => {
    const newUser = {
        name: req.body.user.toUpperCase(),
        email: req.body.userEmail,
        descr: req.body.description,
        desig: req.body.designation,
        linkedin: req.body.linkedIn,
        password: req.body.psw,
        image: req.file.filename
    }
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');

        collection.insertOne(newUser);

        let mailOptions_user = {
            from: '<<AdminEmail-1>>',
            to: '<<AdminEmail-2>>',
            subject: 'Notification from "The Next AI" Website - New User',
            text: `A New User created an account in the AI Website. 
            The details are :
            1. Name : ${req.body.user}
            2. Email : ${req.body.userEmail}
            3. Designation/ Job Title : ${req.body.designation}
            4. Description ; ${req.body.description}`
        };

        transporter.sendMail(mailOptions_user, function(err, data){
            if(err) {
                console.log('Error Occurs !!!!!')
            } else {
                console.log('Email notification Sent to the Admin after a New User Account is created!!');
            }
        });

        client.close();
        res.redirect('/Users');
    });
  };

module.exports = {
    get: get_Users,
    create: create_Users,
    post: post_Users
};
