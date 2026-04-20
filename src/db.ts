const mongoose = require('mongoose')
const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId
const User = new Schema({
    email : { type:String, required : true, unique: true},
    username : { type:String, required : true, unique: true},
    password : { type:String, required : true}
})
const Content = new Schema({
    link : {type:String },
    userId : {type: ObjectId, required: true},
    type: {type:String, enum : ['document', 'tweet', 'youtube', 'link' , 'article'], required: true},
    title: {type:String, required: true},
    tags : [{type:ObjectId, ref:'Tags'}],
    date : {type: Date}, 
    embedding : {type: [Number], default: []}
})
const Tags = new Schema({
    tag : {type:String, unique: true, trim: true}
})
const Link = new Schema({
    userId : {type:ObjectId, required: true, unique: true}, 
    hash : {type: String}
})
export const UserModel = mongoose.model('users', User);
export const ContentModel = mongoose.model('Content', Content);
export const TagModel = mongoose.model('Tags', Tags);
export const LinkModel = mongoose.model('Link', Link)
