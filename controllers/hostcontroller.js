const Resturant=require("../models/resturant")

exports.getaddresturant=(req,res,next)=>{
    res.render('host/edit-resturant',{pagetitle:'addresturant',editing:false})
}
exports.geteditresturant=(req,res,next)=>{
    const resturantid=req.params.resturantid;
    const editing=req.query.editing ==='true';
    Resturant.findbyid(resturantid).then(resturant=>{
        if(!resturant){
            console.log("resturant not found")
            return res.redirect("/host/host-resturant-list")
        } 
    res.render('host/edit-resturant',{pagetitle:'editresturant',editing:editing,resturant:resturant})
    })  
}



exports.gethostresturants=(req,res,next)=>{
    Resturant.fetchAll().then(regresturants=>{
        res.render('host/host-resturant-list',{regresturants:regresturants,pagetitle:'host resturant list'})
    })  
}

exports.postaddresturant=(req,res,next)=>{
    
    const editing=req.query.editing ==='true';
    const {housename,price,location,rating,photo,description}=req.body
    const resturant=new Resturant(housename,price,location,rating,photo,description)
    resturant.save().then(()=>{
        console.log("resturant added ")
    })
    res.render('host/resturantadded',{pagetitle:'resturantadded',editing:editing})
}
exports.posteditresturant=(req,res,next)=>{
    const {housename,price,location,rating,photo,description}=req.body
    const resturant=new Resturant(housename,price,location,rating,photo,description)
    resturant.save().then(result=>{
        console.log('resturant updated'.result)
    })
    res.redirect('/host/host-resturant-list')
}
exports.postdeleteresturant=(req,res,next)=>{
    const resturantid=req.params.resturantid
    Resturant.deletebyid(resturantid).then(()=>{
        res.redirect('/host/host-resturant-list');
    }).catch(error=>{
console.log("error while deleting")
    });
    
   
}

