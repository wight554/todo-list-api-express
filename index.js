const express = require('express'),
      bodyParser = require('body-parser'),
      methodOverride = require('method-override'),
      mongodb = require('mongodb');

const app = express(),
      port = process.env.PORT || 3000,
      mongoClient = mongodb.MongoClient,
      mongoUrl = process.env.MONGODB_URI || `mongodb://localhost:27017/todo-api`,
      ObjectId = mongodb.ObjectID;

let mongo = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(methodOverride('_method'))
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

mongoClient
    .connect(mongoUrl, { useNewUrlParser: true })
    .then(client => {
        mongo = client.db();
    });

app.get('/', (req, res) => {
    mongo
        .collection('tasks').find().toArray()
        .then(tasks => {
            res.render('', { tasks });
        })
});

app.get('/tasks/new', (req, res) => {
    res.render('new');
});

app.post('/tasks', (req, res) => {
    mongo
        .collection('tasks')
        .insertOne(req.body)
        .then(() => {
            res.redirect('/');
    });
});

app.get('/tasks/:id', (req, res) => {
    mongo
        .collection('tasks')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(task => {
            res.render('show', { task });
        });
});

app.get('/tasks/:id/edit', (req, res) => {
    mongo
        .collection('tasks')
        .findOne({ _id: ObjectId(req.params.id) })
        .then(task => {
            res.render('edit', { task });
        });
});

app.post('/tasks/:id/update', (req, res) => {
    mongo
        .collection('tasks')
        .updateOne({ _id: ObjectId(req.params.id) }, {$set: {"name": req.body.name}})
        .then(() => {
            res.redirect('/');
        });
});

app.delete('/tasks/:id/destroy', (req, res) => {
    mongo
        .collection('tasks')
        .deleteOne({ _id: ObjectId(req.params.id) })
        .then(() => {
            res.redirect('/');
        });
});

app.listen(port, () => {
    console.log("APP IS RUNNING ON PORT " + port);
})
