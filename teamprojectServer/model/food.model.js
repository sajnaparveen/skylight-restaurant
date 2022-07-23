const mongoose=require('mongoose')
const crypto=require('crypto')


  
const foodSchema =  new mongoose.Schema({
    uuid:{type:String,required:false},
    foodName:{type:String,required:false},
    Price:{type:String,required:false},
    ingredients:{type:String,required:false},
    Offer:{type:String,required:false},
    OfferPrice:{type:String,required:false},
    categoryUuid:{type:String,required:false},
    foodImage:{type:String,required:false},
    userUuid:{type:String,required:false},
    quantity:{type:String,required:false},
    imgUrl:{type:String,required:false}

},{
    timestamps:true
})

foodSchema.pre('save',function(next){
    this.uuid='FOOD-'+crypto.pseudoRandomBytes(5).toString('hex').toUpperCase()
    console.log(this.uuid)
    next()
})

module.exports=mongoose.model('fooditem',foodSchema,'fooditem')
