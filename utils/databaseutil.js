const mongo=require('mongodb');
const mongoclient=mongo.MongoClient;
const MONGO_URL="mongodb+srv://ashish20244045:patanahi@streetbitecluster0.lsx3p.mongodb.net/?retryWrites=true&w=majority&appName=streetbiteCluster0";

let _db;
const mongoconnect=(callback)=>{
mongoclient.connect(MONGO_URL).then(client=>{
    callback()
    _db=client.db('streetbites')
}).catch(err=>{
    console.log('error while connecting mongo',err)
});
}
const getdb=()=>{
    if(!_db){
        throw new Error('mongo not connected')
    }
    return _db
}
exports.mongoconnect=mongoconnect
exports.getdb=getdb