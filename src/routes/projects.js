const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');
const url = 'mongodb://mongodb:27017';

const get_Project = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('projects');

        collection.find({}).toArray((error, documents) => {
            client.close();
            documents.reverse();
            const projectsVariables = {
                pageTitle: "First page of our app",
                projects: documents
            }
            res.render('Projects', { projectsVariables: projectsVariables });
        });
    });
 };

const upload_Project = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('users');
		var userNameList = []
        collection.find({}).toArray((error, documents) => {
            client.close();
			documents.forEach(document => { 
				userNameList.push(document.name);
			}); 
            res.render('Upload_Project', { userNameList: userNameList});
        });
    });
 };

const delete_Project = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('projects');
        const idToDelete_project = req.params.id;

        collection.deleteOne({ "_id": ObjectID(idToDelete_project) });
        client.close();
        res.redirect('/Projects');
    });
 };

const download_Project = (req, res) => {
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('projects');
        const idToDownload_dataset = req.params.id;
        
        var myDocument = collection.find({ "_id": ObjectID(idToDownload_dataset) }).toArray((error, documents) => {
            const download_file = __dirname+'/../../public/img/users/'+ documents[0].project;
            res.download(download_file)
            client.close(); 
        });
    });
};

const post_Project = (req, res) => {
    const newProject = {
        name: req.body.name,
        type: req.body.type,
        descr: req.body.description,
        lang: req.body.language,
        userName:req.body.userName,
        //date: req.body.date,
        project: req.file.filename
    }
    
    //Replace .push() to a mongodb call
    MongoClient.connect(url, function (err, client) {
        const db = client.db('AI_Datasets');
        const collection = db.collection('projects');

        collection.insertOne(newProject);

        client.close();
        res.redirect('/Projects');
    });
};

module.exports = {
    get: get_Project,
    upload: upload_Project,
    delete: delete_Project,
    download: download_Project,
    post: post_Project
};
