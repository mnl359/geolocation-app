const mongoose = require('mongoose');

mongoose.connect('mongodb://mongo-server:27017/project1', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then (db => console.log('DB is connected'))
.catch(err => console.error(err));
