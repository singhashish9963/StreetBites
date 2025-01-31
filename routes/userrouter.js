//core module
const path=require("path")

const express=require("express")
// const rootdir=require("../utils/pathutil")
const { getbookings, getfavouritelist, getindex, getresturantdatils, getresturantdetails, postaddfavourites, postremovefromfavourites,getresturantitems } = require("../controllers/storecontroller")
const {getresturants}=require("../controllers/storecontroller")

const userrouter=express.Router()


userrouter.get("/",getindex)
userrouter.get("/bookings",getbookings)
userrouter.get("/favourites",getfavouritelist)
userrouter.get("/index",getresturants)
userrouter.get("/resturants/:resturantid",getresturantdetails)
userrouter.get("/resturantitems/:resturantid",getresturantitems)
userrouter.post("/favourites",postaddfavourites)
userrouter.post("/favourites/delete/:resturantid",postremovefromfavourites)


module.exports=userrouter