const express=require("express")
const path=require("path")


//local module
const userrouter=require("./routes/userrouter")
const {hostrouter} = require("./routes/hostrouter")
const rootdir=require("./utils/pathutil")
const db=require("./utils/databaseutil")
const {mongoconnect} = require("./utils/databaseutil")



const app=express()
app.use(express.json());

app.set('view engine','ejs')
app.set('views','views')

app.use((req,res,next)=>{
    
   next();
})



app.use(express.urlencoded())

app.use(userrouter)
app.use(hostrouter)
app.use(express.static(path.join(rootdir,"public")))

app.get("/extra",(req,res,next)=>{
    res.render('extra')
})

let bucket = [];
app.post('/add-to-bucket', (req, res) => {
    const item = req.body.item;
    bucket.push(item);
    res.status(200).send();
});
app.get('/bucket', (req, res) => {
    res.render('store/bucket', { bucket:bucket,pagetitle:"my bucket" });
    console.log({bucket})
    
});



//use at last only
app.use((req,res,next)=>{
    res.status(404).render('404',{pagetitle:'pagenotfound'})   
})


const PORT=3005;
mongoconnect(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running on http://localhost:${PORT}`)
    })
})
