const mongoose=require('mongoose')
const crypto=require('crypto')

const categorySchema =new mongoose.Schema({
    uuid:{type:String,required:false},
    CategoryName:{type:String,required:true,trim:true},
    Description:{type:String,required:true},
    userUuid: {type: String, required: true}
},{
    timestamps:true
})


categorySchema.pre('save',function(next){
    this.uuid='CATE-'+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid)
    next();
})
module.exports = mongoose.model('foodCategory', categorySchema, 'foodCategory');
