const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27018/project1', {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false
})
.then (db => console.log('DB is connected'))
.catch(err => console.error(err));
