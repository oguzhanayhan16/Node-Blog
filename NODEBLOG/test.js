const mongoose = require('mongoose')

const Post = require('./models/post')

mongoose.connect('mongodb://127.0.0.1/nodeblog_test_db')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Connection error', err));


Post.create({
    title: 'Benim ilk Post Başlığım.',
    content: 'Post içeriği, lorem ipsum.'
}).then(post => {
    console.log(post);
  })
  .catch(err => {
    console.error(err);
  });