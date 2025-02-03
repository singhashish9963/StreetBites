
const {getdb}=require("../utils/databaseutil")
const {ObjectId}=require('mongodb')
module.exports=class Resturant{
    constructor(resturantname,price,location,rating,photo,description,_id){
        this.resturantname=resturantname
        this.price=price
        this.location=location
        this.rating=rating
        this.photo=photo
        this.description=description
        if(_id){
            this._id=_id
        }
    }
    save() {
        const db=getdb();
        if(this._id){
            const updatefields={
                resturantname:this.resturantname,
                price:this.price,
                location:this.location,
                rating:this.rating,
                photo:this.photo,
                description:this.description
            }
           return db.collection('resturants').updateOne({_id:new ObjectId(String(this._id))},{$set:updatefields},{_id:this._id})

        } else {
            return db.collection('resturants').insertOne(this)
        }
       
       }
    static fetchAll(){
        const db=getdb();
        return db.collection('resturants').find().toArray()
    }
    static findbyid(resturantid,callback){
        const db = getdb();
        return db.collection('resturants').find({_id:new ObjectId(String(resturantid))}).next();
    }
    static deletebyid(resturantid,callback){
        const db = getdb();
        return db.collection('resturants').deleteOne({_id:new ObjectId(String(resturantid))});
    }
}