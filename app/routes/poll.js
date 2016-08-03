module.exports = function(app){
    
    var Poll = require("../models/poll");
    var Answer = require("../models/answer");
    //==========================================================================
    //Poll =====================================================================
    //==========================================================================
    app.get('/poll/all',function(req,res){
        console.log("Trying to get all polls");
        //Get all poll
        Poll.find({},function(err,polls){
            if(err) throw err;
            console.log(polls);
            //Send them to the res
            res.status(200).render('index',{polls:polls});
        });
    });
    
    app.get('/poll/new',isLoggedIn,function(req,res){
        console.log("redirect to create");
        res.render('create');
    });
    
    app.post('/poll/new',isLoggedIn, function(req,res) {
        console.log(req.body);
        var poll = new Poll();
        if(req.body.title){
            poll.title = req.body.title;
        }
        if(req.body.answers){
            var answers = req.body.answers.split("\r\n");
        }
        
        poll.save(function(err){
            if (err) throw err;
            //Saved the answers
            answers.forEach(function(element){
               var answer = new Answer({
                   title: element,
                   id_poll:poll._id
               });
               answer.save(function(err){
                   if(err){
                       console.log(err);
                   }
               });
            });
            res.status(200).redirect('/poll/'+poll._id);
        });
        
        //Get the poll from the req
        //Insert it into the database
       //If success -> redirect to the poll details
       //If fails -> display an error message in the same page
    });
    
    app.get('/poll/:id',isLoggedIn,function(req,res){
       //Get the poll from the req
        //Insert it into the database
       //If success -> redirect to the poll details
       //If fails -> display an error message in the same page
       Poll.findById(req.params.id,function(err,poll){
            if(err) throw err;
            console.log(poll);
            Answer.find({id_poll:poll._id},function(err,answers){
                if(err) throw err;
                console.log(JSON.stringify({
                                                poll:poll,
                                                answers:answers
                                            }));
                res.render('detail',{
                                        poll:poll,
                                        answers:answers
                                    });
            });
       });
    });
    
    
    //====================================================================================================
    //Route middleware to make sure a user is logged in ==================================================
    //====================================================================================================
    function isLoggedIn(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }
        res.redirect('/');
    }
};