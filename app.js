
const express=require("express")
const path=require("path")
const fs = require('fs');


//local module
const userrouter=require("./routes/userrouter")
const {hostrouter} = require("./routes/hostrouter")
const rootdir=require("./utils/pathutil")
const db=require("./utils/databaseutil")
const {mongoconnect} = require("./utils/databaseutil")

const usersFilePath = path.join(__dirname, 'users.json');

function loadUsersFromFile() {
    if (fs.existsSync(usersFilePath)) {
        const data = fs.readFileSync(usersFilePath);
        return JSON.parse(data);
    }
    return [];
}

// Function to save users to a JSON file
function saveUsersToFile(users) {
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

if (process.env.NODE_ENV !== "production") {
    require("dotenv").config()
}

const app=express()
app.use(express.json());
// Importing all Libraies that we installed using npm

const bcrypt = require("bcrypt") // Importing bcrypt package
const passport = require("passport")
const initializePassport = require("./passport-config")
const flash = require("express-flash")
const session = require("express-session")
const methodOverride = require("method-override")

const users=loadUsersFromFile()


const resturantsFilePath = path.join(__dirname, 'resturants.json');
function saveResturantsToFile(resturants) {
    fs.writeFileSync(resturantsFilePath, JSON.stringify(resturants, null, 2));
}


initializePassport(
    passport,
    email => users.find(user => user.email === email),
    id => users.find(user => user.id === id)
    )

app.use(express.urlencoded({extended: false}))
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false, // We wont resave the session variable if nothing is changed
    saveUninitialized: false
}))
app.use(passport.initialize()) 
app.use(passport.session())
app.use(methodOverride("_method"))

// Configuring the register post functionality
app.post("/login", checkNotAuthenticated, passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/login",
    failureFlash: true
}))

// Configuring the register post functionality
app.post("/register", checkNotAuthenticated, async (req, res) => {

    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10)
        users.push({
            id: Date.now().toString(), 
            name: req.body.name,
            email: req.body.email,
            password: hashedPassword,
        })
        saveUsersToFile(users)
        console.log(users); // Display newly registered in the console
        req.flash("registered ,now please login")
        res.redirect("/login")
        
    } catch (e) {
        console.log(e);
        req.flash("error")
        res.redirect("/register")
    }
})

// Routes
app.get('/', checkAuthenticated, (req, res) => {
    res.render("extra")
})

app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render("login",{ messages: req.flash() })
})

app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register", { messages: req.flash() })
})

app.get('/profile', checkAuthenticated, (req, res) => {
    res.render('store/profile', { user: req.user });
});
app.post('/profile', checkAuthenticated, (req, res) => {
    const user = users.find(user => user.id === req.user.id);
    if (user) {
        user.name = req.body.name;
        saveUsersToFile(users); // Save updated users to JSON file
        req.flash('success', 'Profile updated successfully');
    } else {
        req.flash('error', 'User not found');
    }
    res.redirect('/profile');
});

// End Routes

// app.delete('/logout', (req, res) => {
//     req.logOut()
//     res.redirect('/login')
//   })

app.delete('/logout', (req, res) => {
    req.logOut(err => {
        if (err) {
            return next(err);
        }
        res.redirect('/login');
    });
});

function checkAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return next()
    }
    res.redirect("/login")
}

function checkNotAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        return res.redirect("/")
    }
    next()
}



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
function loadResturantsFromFile() {
    if (fs.existsSync(resturantsFilePath)) {
        const data = fs.readFileSync(resturantsFilePath);
        return JSON.parse(data);
    }
    return [];
}
const regresturants = loadResturantsFromFile()
app.post('/add-food-item', (req, res) => {
    const { resturantId, foodName, foodPrice } = req.body;
    const resturant = regresturants.find(r => r.id === resturantId);
    if (resturant) {
        if (!resturant.foodItems) {
            resturant.foodItems = [];
        }
        resturant.foodItems.push({ name: foodName, price: foodPrice });
        saveResturantsToFile(regresturants); // Save updated restaurants to JSON file
        req.flash('success', 'Food item added successfully');
    } else {
        req.flash('error', 'Restaurant not found');
    }
    res.redirect('/host/host-resturant-list');
});



//use at last only
app.use((req,res,next)=>{
    res.status(404).render('404',{pagetitle:'pagenotfound'})   
})


const PORT=3004;
mongoconnect(()=>{
    app.listen(PORT,()=>{
        console.log(`server is running on http://localhost:${PORT}`)
    })
}) 
