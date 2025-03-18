const mongoose = require('mongoose')
const Schema = mongoose.Schema; 
const PostSchema = new mongoose.Schema({
    title:{
        type:String,require:true
    },
    author:{
        type:Schema.Types.ObjectId,ref:'users'
    },
    content:{
        type:String,require:true
    },
    date:{
        type:Date,default:Date.Now
    },
    category:{
        type:Schema.Types.ObjectId,ref:'categories'
    },
    post_image:{
        type:String,require:true
    }
})

module.exports=mongoose.model('Post',PostSchema)

