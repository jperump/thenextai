const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://localhost:27017';
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

const get_Contact = (req, res) => {
    res.render('contact');
};

const post_Contact = (req, res) => {
    let mailOptions = {
        from: '<<AdminEmail-1>>',
        to: '<<AdminEmail-2>>',
        subject: 'Message from a visitor in "The Next AI" Website',
        text: `A visitor by the name ${req.body.name} has contacted you. The details are :
        
        1. Name : ${req.body.name} 
        2. Email : ${req.body.email}
        3. Country ; ${req.body.country}
        4. Message : ${req.body.subject}`
    };

    transporter.sendMail(mailOptions, function(err, data){
        if(err) {
            console.log('Error Occurs !!!!!')
        } else {
            console.log('Contact message is sent to the Admin');
        }
    });
    res.redirect('/');
};

module.exports = {
    get: get_Contact,
    post: post_Contact
}