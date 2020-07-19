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

const single_User = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
        const selectedId = req.params.id;

        collection.find({ "_id": ObjectID(selectedId) }).toArray((error, documents) => {
			db.collection('projects').find({"userName":documents[0].name}).toArray(function(err, projectList) {
				client.close();
				res.render('user', { user: documents[0] ,projectList:projectList });
			});			
        });
    });
  };

const update_User = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
        const selectedId = req.params.id;

        collection.find({ "_id": ObjectID(selectedId) }).toArray((error, documents) => {
            client.close();
            res.render('update', { user : documents[0] });
        });
    });
  };

const delete_User = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
        const idToDelete = req.params.id;

        collection.find({ "_id": ObjectID(idToDelete) }).toArray((error, documents) => {
            let mailOptions_user = {
                from: '<<AdminEmail-1>>',
                to: '<<AdminEmail-2>>',
                subject: 'Notification from "The Next AI" Website - User Deleted Account',
                text: `A  User deleted their account in the AI Website. 
                The details are :
                1. Name : ${documents[0].name}
                2. Email : ${documents[0].email}
                3. Designation/ Job Title : ${documents[0].desig}
                4. Description : ${documents[0].descr}`
            };

            transporter.sendMail(mailOptions_user, function(err, data){
                if(err) {
                    console.log('Error Occurs !!!!!')
                } else {
                    console.log('Email notification Sent to the Admin after a User Account is deleted!!');
                }
            });
        });
        collection.deleteOne({ "_id": ObjectID(idToDelete) });
        client.close();
        res.redirect('/Users');
    });
  };

const post_update_User = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
        const selectedId = req.params.id;

        let filter = { "_id": ObjectID(selectedId) };

        let updateObject = {
            "name": req.body.user.toUpperCase(),
            "email": req.body.userEmail,
            "descr": req.body.description,
            "desig": req.body.designation,
            "password": req.body.psw,
            "linkedin": req.body.linkedIn,
        }

        if (req.file){
            
            updateObject.image = req.file.filename;
        }
        
        let update = {
            $set: updateObject
        };

        collection.updateOne(filter, update);

        client.close();
        res.redirect('/Users');
    });
  };

module.exports = {
    user: single_User,
    update: update_User,
    delete: delete_User,
    post_update: post_update_User
};
