const express = require('express')
const router = express.Router()
const Category = require('../../models/category')
const Post = require('../../models/post')
const path = require('path')

 router.get('/', (req, res) => {
 
    res.render("admin/index")
 })

 router.get('/categories', (req, res) => {
 
   Category.find({}).sort({$natural:-1}).lean().then(categories=>{
      res.render('admin/categories',{categories:categories})
   })
 })

 router.post('/categories', async (req, res) => {
   try {
  
     const category = await Category.create(req.body);
     res.redirect('categories'); // Başarı durumunda yönlendirme yapılır
   } catch (error) {
     console.error(error);
     res.status(500).send('Bir hata oluştu'); // Hata durumunda yanıt
   }
 });
router.delete('/categories/:id', async (req, res) => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.redirect('/admin/categories');
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});


router.get('/posts', (req, res) => {
 
  Post.find({}).populate({path:'category',model:Category}).sort({$natural:-1}).lean().then(posts => {
   
       res.render('admin/post',{posts:posts})
 

 })
    

})

router.delete('/posts/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id);
    res.redirect('/admin/posts');
  } catch (error) {
    console.error(error);
    res.status(500).send('Bir hata oluştu');
  }
});

router.get('/posts/edit/:id', (req, res) => {
 
  Post.findOne({_id:req.params.id}).then(post=>{
    Category.find({}).lean().then(categories=>{
      res.render('admin/editpost',{post:post,categories:categories})
    })
  })

})


router.put('/posts/:id',(req,res)=>{
  let post_image =req.files.post_image
  post_image.mv(path.resolve(__dirname,'../../public/img/postimages',post_image.name))

  Post.findOne({_id:req.params.id}).then(post=>{

    post.title=req.body.title,
    post.content=req.body.content
    post.date =req.body.date
    post.category=req.body.category
    post.post_image=`/img/postimages/${post_image.name}`

    var post = new Post(post);
    post.save().then(post=>{res.redirect('/admin/posts')})
    
  })
})

 module.exports=router