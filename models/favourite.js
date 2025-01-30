const {getdb}=require("../utils/databaseutil")
module.exports=class Favourite{
    constructor(resturantid){
        this.resturantid=resturantid
    }
    
save(){
    const db=getdb();
    return db.collection('favourites').findOne({resturantid:this.resturantid}).then(existingfav=>{
        if(!existingfav){
            return db.collection('favourites').insertOne(this)
        }
        return Promise.resolve();
    })


}

    
    static getfavourites(callback){
        const db=getdb();
        return db.collection('favourites').find().toArray()
    }
    static deletebyid(delresturantid){
          const db = getdb();
                  return db.collection('favourites').deleteOne({resturantid:(delresturantid)})  
        }
    }
    

    
