var express = require("express");
var app = express();

app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    res.render("home");
    //res.send("YOu have made something");
});

app.get("/landing", function(req, res){
    res.render("landing");
});

app.get("/qualifications", function(req, res){
    res.render("qualifications")
});


app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/todo", function(req, res){
    res.render("todo");
});

app.listen(3000, function(){
    console.log("Server has Started!!!");
});