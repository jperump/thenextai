const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://mongodb:27017';

const get_Form = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
        const idToLogin = req.params.id;
        
        //console.log(idToLogin)
        collection.find({ "_id": ObjectID(idToLogin) }).toArray((error, documents) => {
            client.close();
            res.render('login', { user: documents[0] });
        });
    });
  };

const user_Login = (req, res) => {
    res.render('userLogin');
  };

const post_Form = (req, res) => {
    const loginName = req.body.user.toUpperCase();

    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
        const idToLogin = req.params.id;
        const password = req.body.psw;
        
        collection.find({ "_id": ObjectID(idToLogin) }).toArray((error, documents) => {
            console.log("Login Name and Password : ", loginName, password)
            console.log("User Name and Password: ", documents[0].name, documents[0].password)
            if ((loginName == documents[0].name) && (password == documents[0].password)) {
                db.collection('projects').find({"userName":documents[0].name}).toArray(function(err, projectList) {
                    client.close();
                    res.render('userLogin', { user: documents[0] ,projectList:projectList });
                });
            }
            else {
                console.log("Error : Names are not same");
                res.redirect('/Users');
            }
            client.close();
        });
    });
  };

module.exports = {
    get: get_Form,
    user: user_Login,
    post: post_Form
};
