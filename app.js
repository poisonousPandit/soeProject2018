var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mysql=require('mysql');
var fs= require('fs');
var path = require('path');
var csv = require('fast-csv'); 
var attendance = [];

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
                           //console.log(result3[0]);
                    
                    res.render("landing", {std:std,result:result[0],course:result1,bank:result2[0],cgpa:result3[0],attend:attendance});   
                    });
                    
                });
                
        });
        
    });
  //  res.render("landing", {std:std,details:result1});
});
app.get("/hostelMess", function(req, res){
    con.query("SELECT * FROM hostel where roll = " + mysql.escape(std.roll), function(err, result5, fields){
        if(err) throw err;
        //console.log(result5[0]);
        //console.log(result5.room);
        con.query("SELECT * FROM Student WHERE roll = " + mysql.escape(std.roll), function (err, result10, fields){
            if(err) throw err;
            
        if(result5[0] === undefined){
         //   console.log("Result 5 in if");
            res.render("hostelMess", {std:std, result:result10[0]});
        }
        else{
           // console.log("Result 5 in else");
             res.render("hostelMessdis", {std:std, hos:result5[0],result:result10[0]});
        }
    });
    });
});
app.get("/qualifications", function(req, res){
    
    res.render("qualifications",{name:name1,roll:roll1});
});


app.get("/contact", function(req, res){
    con.query("SELECT * FROM personalDetails where roll = " + mysql.escape(std.roll), function(err, result9, fields){
        if(err) throw err;
        console.log(result9[0]);
        //console.log(result5.room);
        con.query("SELECT * FROM Student WHERE roll = " + mysql.escape(std.roll), function (err, result11, fields){
            if(err){
                throw err;
            }
        if(result9[0] === undefined){
            console.log("Result 9 in if");
            res.render("contact", {std:std, result:result11[0]});
        }
        else{
            console.log("Result 9 in else");
             res.render("contactdis", {std:std, person:result9[0], result:result11[0]});
        }
    });
    });
});

app.get("/todo", function(req, res){
    con.query("SELECT * FROM Student WHERE roll = " + mysql.escape(std.roll), function (err, result12, fields){
        if(err){
            throw err;
        }
        res.render("todo", {std:std, result:result12[0]});
    });
});



app.post("/",function (req,res) {
    var rol=req.body.roll;
    var pass=req.body.pass;
   // console.log(rol+" "+pass);
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
               // console.log(std);
                if (typeof std !== 'undefined' && std.password == pass) {
                    console.log(" inside if");
                    attendance=[]
                    var stream = fs.createReadStream(path.resolve("./", "new.csv"))
                    .pipe(csv.parse({headers: true}))
                    .transform(function (row) {
                        return {
                            id: row.id,
                            roll_no: row["Roll"],
                            present: row["Present"],
                            total: row.Total
                        };
                    })
                    .on("readable", function () {
                        var row;
                        while (null !== (row = stream.read())) {
                            //console.log(row);
                            //if(row.roll_no===std.roll)
                            attendance.push(row);

                        }
                      //  console.log(attendance);
                    })
                    
                    res.redirect("/landing");
                }
                else {
                    res.redirect("/");
                }
            }
        }
    });
});

app.post("/hostelMess", function (req,res){
    var room = req.body.room;
    var hostel = req.body.hostel;
    console.log(room + " " + hostel);
    con.query("INSERT INTO hostel values("+mysql.escape(std.roll)+","+mysql.escape(room)+","+mysql.escape(hostel)+");",function(err,result7,fields){
        if(err)throw err;
        console.log(result7);
        res.redirect("/hostelMess");
    }); 
});

app.post("/contact", function(req, res){
    var father = req.body.father, mother = req.body.mother, email = req.body.email ,
    mobileNo = req.body.mobileNo , parentMobile = req.body.parentMobile , address = req.body.address, 
    hs_sc_name = req.body.hs_sc_name , hs_sc_address = req.body.hs_sc_address , hs_aff_board = req.body.hs_aff_board , hs_cg = req.body.hs_cg,
    int_sc_name = req.body.int_sc_name, int_sc_address = req.body.int_sc_address, int_aff_board = req.body.int_aff_board, int_cg = req.body.int_cg ,
    qual_exam = req.body.qual_exam , qual_roll = req.body.qual_roll , qual_rank = req.body.qual_rank;
    if(father==null){
        res.redirect("/contact");
    }else{
    console.log(mother+email+mobileNo+parentMobile+address+hs_sc_name+hs_sc_address+hs_aff_board+hs_cg+int_aff_board+int_sc_name+int_sc_address+int_cg+qual_exam+qual_roll+qual_rank);
    con.query("INSERT INTO personalDetails values("+mysql.escape(std.roll)+","+mysql.escape(father)+","+mysql.escape(mother)+","+mysql.escape(email)+","
+mysql.escape(mobileNo)+","+mysql.escape(parentMobile)+","+mysql.escape(address)+","+mysql.escape(hs_sc_name)+","+mysql.escape(hs_sc_address)+","+mysql.escape(hs_aff_board)+","+mysql.escape(hs_cg)+","
+mysql.escape(int_sc_name)+","+mysql.escape(int_sc_address)+","+mysql.escape(int_aff_board)+","+mysql.escape(int_cg)+","
+mysql.escape(qual_exam)+","+mysql.escape(qual_roll)+","+mysql.escape(qual_rank)+");", function(err, result8,fields){
    if(err)throw err;
        console.log(result8);
        res.redirect("/contact");
});}
});

app.listen(8082, function(){
    console.log("Server has Started!!!");
});