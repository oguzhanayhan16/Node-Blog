const express = require('express')
const router = express.Router()
const User =require('../models/user')

router.get('/register', (req, res) => {
    res.render('site/register')
 })
 
 router.post('/register', (req, res) => {
    User.create({
        ...req.body
      })
      req.session.sessionFlash={
        type:'alert alert-success',
        messages:'Kullanıcı başarılı bir şekilde oluşturuldu'
     }
      res.redirect('/users/login')
 })
 
 router.get('/login', (req, res) => {
    res.render('site/login')
 })
 
 router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // User.findOne() artık bir Promise döndürür
      const user = await User.findOne({ email });
  
      if (user) {
        // Parolayı kontrol edin (güvenlik için bcrypt gibi bir kütüphane kullanmanız önerilir)
        if (user.password === password) {
          req.session.userId=user._id
          res.redirect('/');
        } else {
          res.redirect('/users/login');
        }
      } else {
        res.redirect('/users/register');
      }
    } catch (error) {
      // Hata durumunu yönetmek için
      console.error(error);
      res.status(500).send('Internal server error');
    }
  });
  
  router.get('/logout', (req, res) => {
    req.session.destroy(()=>{
      res.redirect('/')
    })
 })


 
 module.exports=router