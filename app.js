const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const mongoose = require("mongoose");
const { MongoClient, ObjectID } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
let url = 'mongodb://mongodb:27017';

app.use(morgan('tiny'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'nextai' }));

app.use(express.static(path.join(__dirname, '/public/')));
app.use('/css', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/css')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/bootstrap/dist/js')));
app.use('/js', express.static(path.join(__dirname, '/node_modules/jquery/dist')));
app.set('views', './src/views');
app.set('view engine', 'pug');

const multer = require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'public/img/users')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '-' + Date.now() + '-' + file.originalname)
  }
})
const upload = multer({ storage: storage });
app.use('/', express.static('public'));

const nav = [
    { link: '/books', title: 'Book' },
    { link: '/authors', title: 'Author' }
  ];

const { get: get_Dataset, upload: upload_Dataset, delete: delete_Dataset, download: download_Dataset, post: post_Dataset }= require('./src/routes/datasets');
const { get: get_Users, create: create_Users, post: post_Users } = require('./src/routes/users');
const { get: get_Form, user: user_Login, post: post_Form } = require('./src/routes/login');
const { get: get_Project, upload: upload_Project, delete: delete_Project, download: download_Project, post: post_Project }= require('./src/routes/projects');
const { user: single_User, update: update_User, delete: delete_User, post_update: post_update_User } = require('./src/routes/user');
const { get: get_Contact, post: post_Contact } = require('./src/routes/contact');

//Datasets
app.get('/datasets', get_Dataset);
app.get('/Upload_Dataset', upload_Dataset);
app.get('/delete_dataset/:id', delete_Dataset);
app.get('/download/:id', download_Dataset);
app.post('/datasets', upload.single('file'), post_Dataset);

//Users
app.get('/Users', get_Users);
app.get('/create', create_Users);
app.post('/users', upload.single('file'), post_Users);

// User - Login
app.get('/login/:id', get_Form);
app.get('/userLogin', user_Login);
app.post('/loginUser/:id', post_Form);

// User
app.get('/users/:id', single_User);
app.get('/update/:id', update_User);
app.get('/delete/:id', delete_User);
app.post('/userUpdate/:id', upload.single('file'), post_update_User);

// Projects
app.get('/Projects', get_Project);
app.get('/Upload_Project', upload_Project);
app.get('/delete_project/:id', delete_Project);
app.get('/download_project/:id', download_Project);
app.post('/user', upload.single('file'), post_Project);

// Contact
app.get('/contact', get_Contact);
app.post('/contact', post_Contact);

app.get('/', (req, res) => {
    res.render(
      'Main_Page', {title: 'next ai'});
});

app.listen(port, () => {
  console.log(`listening at port ${chalk.green(port)}`);
  });
  