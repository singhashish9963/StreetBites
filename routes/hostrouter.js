const path=require("path")
const express=require("express")


const hostrouter=express.Router()
const rootdir=require("../utils/pathutil");
const { getaddresturant, postaddresturant, gethostresturants, geteditresturant, posteditresturant, postdeleteresturant } = require("../controllers/hostcontroller");

hostrouter.get("/host/add-resturant",getaddresturant);
hostrouter.post("/host/add-resturant",postaddresturant)
hostrouter.get("/host/host-resturant-list",gethostresturants)
hostrouter.get("/host/edit-resturant/:resturantid",geteditresturant)
hostrouter.post("/host/edit-resturant",posteditresturant)
hostrouter.post("/host/delete-resturant/:resturantid",postdeleteresturant)


exports.hostrouter=hostrouter
