const Favourite = require("../models/favourite")
const Resturant=require("../models/resturant")



exports.getresturants=(req,res,next)=>{
    Resturant.fetchAll().then(regresturants=>{
        res.render('store/resturant-list',{regresturants:regresturants,pagetitle:'resturant list'})
    })  
}
exports.getindex=(req,res,next)=>{
    Resturant.fetchAll().then(regresturants=>{
        res.render("store/index",{
            regresturants:regresturants,pagetitle:"streetbites resturant"
        })
    })  
}

exports.getbuckets=(req,res,next)=>{
   res.render("store/bucket",{
    pagetitle:"my bucket"
   })  
}
exports.getfavouritelist=(req,res,next)=>{
    Favourite.getfavourites().then(favourites=>{
        favourites=favourites.map(fav=>fav.resturantid)
        Resturant.fetchAll().then(regresturants=>{ 
            const favouriteresturants=regresturants.filter(resturant=>
            favourites.includes(resturant._id.toString()));
            res.render('store/favourite-list',{favouriteresturants:favouriteresturants,pagetitle:'streetbites resturant'})
    })
    })
}
exports.postaddfavourites=(req,res,next)=>{
    const resturantid=req.body.id
    const fav=new Favourite(resturantid)
   fav.save().then(result=>{
    console.log('fav added',result)
   }).catch(err=>{
    console.log("error while fav")

   }).finally(()=>{
    res.redirect("/favourites")
   })
   
    
}
exports.postremovefromfavourites=(req,res,next)=>{
   const resturantid=req.params.resturantid;
   Favourite.deletebyid(resturantid).then(result=>{
    console.log('fav removed',result)
}).catch(err=>{
 console.log("error while removng fav")

}).finally(()=>{
 res.redirect("/favourites")
})
    
}


exports.getresturantdetails=(req,res,next)=>{
   const resturantid=req.params.resturantid;
   Resturant.findbyid(resturantid).then(resturant=>{
if(!resturant){
    console.log("resturant not found")
    res.redirect("/")
} else{
    res.render('store/resturant-detail',{pagetitle:'resturant detail',resturant:resturant})
    
    
}}) 
}
exports.getresturantitems=(req,res,next)=>{
    const resturantid=req.params.resturantid;
    Resturant.findbyid(resturantid).then(resturant=>{
 if(!resturant){
     console.log("resturant not found")
     res.redirect("/")
 } else{
     res.render('store/resturant-items',{pagetitle:'resturant detail',resturant:resturant})
     
     
 }}) 
 }