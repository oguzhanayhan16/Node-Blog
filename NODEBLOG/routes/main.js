const express = require('express')
const router = express.Router()
const Post =require('../models/post')
const Category = require('../models/category')
const User = require('../models/user')
router.get('/', (req, res) => {
   console.log(req.session)
    res.render('site/index')
 })
 
 router.get('/blog', (req, res) => {
   const postPerPage = 2;
   const page = req.query.page || 1;
 
   // Postları getir, sayfa başına belirtilen kadar veriyi atla ve limitle
   Post.find({})
     .populate({ path: 'author', model: User })
     .sort({ $natural: -1 })
     .lean()
     .skip((postPerPage * page) - postPerPage)
     .limit(postPerPage)
     .then(posts => {
       
       // Toplam post sayısını almak için countDocuments() fonksiyonunu çağır
       Post.countDocuments().then(postCount => {
         // Kategorileri aggregate kullanarak getir
         Category.aggregate([
           {
             $lookup: {
               from: 'posts',
               localField: '_id',
               foreignField: 'category',
               as: 'posts'
             }
           },
           {
             $project: {
               _id: 1,
               name: 1,
               num_of_posts: { $size: '$posts' }
             }
           }
         ]).then(categories => {
           // Blog sayfasını render et ve gerekli verileri gönder
           res.render('site/blog', {
             posts: posts,
             categories: categories,
             current: parseInt(page),
             pages: Math.ceil(postCount / postPerPage) // Sayfa sayısını hesapla
           });
         }).catch(err => {
           console.error("Category Aggregate Error: ", err);
           res.status(500).send("Server Error");
         });
       }).catch(err => {
         console.error("Post Count Error: ", err);
         res.status(500).send("Server Error");
       });
 
     }).catch(err => {
       console.error("Post Find Error: ", err);
       res.status(500).send("Server Error");
     });
 });
//  router.get('/admin', (req, res) => {
//     res.render('admin/index')
//  })
 
 router.get('/contact', (req, res) => {
    res.render('site/contact')
 })
 
 router.get('/login', (req, res) => {
    res.render('site/login')
 })
 



module.exports=router