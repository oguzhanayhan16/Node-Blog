const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema({
    name:{
        type:String,require:true,unique:true
    },
 
})

module.exports=mongoose.model('category',CategorySchema)
