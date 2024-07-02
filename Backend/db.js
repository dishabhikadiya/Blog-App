const mongoose = require('mongoose');
const app = require('./app');
const dbUri =
  'mongodb+srv://disha:disha@cluster0.mvi6yat.mongodb.net/blog?authSource=admin&replicaSet=atlas-bh0ckl-shard-0&readPreference=primary&appname=MongoDB%20Compass&ssl=true';
mongoose
  .connect(dbUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('mongodb connected');
  })
  .catch(() => {
    console.log('error');
  });
