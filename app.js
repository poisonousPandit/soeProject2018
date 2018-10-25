var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql=require('mysql');


var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Akkki@12345",
    database: "dashboard"
  });
  

  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static(__dirname + '/public'));

app.get("/", function(req, res){
    std="";
    res.render("home");
    //res.send("YOu have made something");
});

app.get("/landing", function(req, res){
    //var rollno = req.param.rollno;
    name1="";    
    roll1=""
    con.query("SELECT * FROM Student WHERE roll = " + mysql.escape(std.roll), function (err, result, fields){
        if(err){
            throw err;
        }
        name1=result[0].name;
        roll1=result[0].roll;
        //console.log(result);
        con.query("SELECT * FROM Course where course_id= "+mysql.escape(result[0].branch)+"and sem = "+mysql.escape(result[0].curr_sem),function(err,result1,fields){
                if(err)throw err;
                //console.log(result1);
                con.query("SELECT * FROM bank_details where roll= "+mysql.escape(std.roll),function(err,result2,fields){
                    if(err)throw err;
                    //console.log(result2);
                    con.query("SELECT * FROM cgpa where roll= "+mysql.escape(std.roll),function(err,result3,fields){
                          if(err)throw err;
                           console.log(result3[0]);
                           res.render("landing", {std:std,result:result[0],course:result1,bank:result2[0],cgpa:result3[0]}); 
                    });
                    
                });
                
        });
        
    });
  //  res.render("landing", {std:std,details:result1});
});

app.get("/qualifications", function(req, res){
    
    res.render("qualifications",{name:name1,roll:roll1});
});


app.get("/contact", function(req, res){
    res.render("contact");
});

app.get("/todo", function(req, res){
    res.render("todo");
});


app.post("/",function (req,res) {
    var rol=req.body.roll;
    var pass=req.body.pass;
    console.log(rol+" "+pass);
    con.query("SELECT * FROM Student_password WHERE roll = " + mysql.escape(rol), function (err, result, fields) {
        std="";
        if (err) throw err;
        console.log(result);
        if(result==[]) {
            alert("Invalid Credentials");
            res.redirect("/");
        }
        else {
            std = result[0];
            if (std == "")
                res.redirect("/");
            else {
                console.log(std);
                if (typeof std !== 'undefined' && std.password == pass) {
                    console.log(" inside if");
                    res.redirect("/landing");
                }
                else {
                    res.redirect("/");
                }
            }
        }
    });
});


app.listen(3002, function(){
    console.log("Server has Started!!!");
});