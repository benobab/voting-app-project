module.exports = function(app){
    
    var Poll = require("../models/poll");
    var Answer = require("../models/answer");
    var Participation = require("../models/participation");
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
    
    app.get('/poll/my',isLoggedIn,function(req,res){
       Poll.find({id_creator:req.user.twitter.id},function(err,polls){
           if(err) 
            throw err;
           console.log("My Polls: "+polls);
           res.status(200).render('mypolls',{polls:polls});
       }) 
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
        console.log(req.user);
        poll.id_creator = req.user.twitter.id;
        
        poll.save(function(err){
            if(err){
                    handleError(req,res,err);
                    return;
                }
            //Saved the answers
            answers.forEach(function(element){
               var answer = new Answer({
                   title: element,
                   id_poll:poll._id
               });
               answer.save(function(err){
                   if(err){
                    handleError(req,res,err);
                    return;
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
    
    app.get('/poll/delete/:id',isLoggedIn,function(req, res) {
       //Check if this is the owner
       var id = req.params.id;
       Poll.findById(id,function(err, poll) {
            if(err) {
                console.log(err);
                res.render('mypolls',{err:err});
            }
            else if(poll.id_creator === req.user.twitter.id) {
                poll.remove(function(err){
                   if(err) throw err;
                   res.redirect('/poll/my');
                });
            }
       });
    });
    
    app.get('/poll/:id',function(req,res){
       //Get the poll from the req
        //Insert it into the database
       //If success -> redirect to the poll details
       //If fails -> display an error message in the same page
       Poll.findById(req.params.id,function(err,poll){
            if(err){
                handleError(req,res,err);
                return;
            }
            console.log(poll);
            Answer.find({id_poll:poll._id},function(err,answers){
                if(err){
                    handleError(req,res,err);
                    return;
                }
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
    
    app.post('/poll/:id/answer/',function(req,res){
        console.log(req.body); 
        var answerSelected = req.body.answerselected;
        //Find if a participation exists
        //If not, add one
        if(req.isAuthenticated()){
            Participation.find({id_poll:req.params.id,id_user:req.user.twitter.id},function(err, parti) {
            if(err){
                handleError(req,res,err);  
                return;
            }
            console.log("User authenticated: "+ req.user.twitter.id + " and participation found: " + parti);
            if(parti.length){
                //Send a message saying that you can't vote twice
                console.log(parti);
                console.log("A participation already exists");
                res.end("You already voted");
            }else{
                var participation = new Participation({
                id_user:req.user.twitter.id,
                id_answer:answerSelected,
                id_poll:req.params.id
            });
            participation.save(function(err){
                if(err){
                    handleError(req,res,err);
                    return;
                } 
                res.end("Thank you for your vote!");
                /*res.redirect('/poll/'+req.params.id);*/ 
            });
            }
            
        });
        }else{
            Participation.find({id_poll:req.params.id,ip_address:req.headers['x-forwarded-for']},function(err, parti) {
            if(err){
                handleError(req,res,err);  
                return;
            }
            console.log(req.headers['x-forwarded-for'] + " trying to vote");
            if(parti.length){
                //Send a message saying that you can't vote twice
                console.log(parti);
                console.log("A participation already exists");
                res.end("You already voted");
            }else{
                var participation = new Participation({
                ip_address:req.headers['x-forwarded-for'],
                id_answer:answerSelected,
                id_poll:req.params.id
            });
            console.log("Will save this participation: "+JSON.stringify(participation));
            participation.save(function(err){
                if(err){
                    handleError(req,res,err);
                    return;
                }
                console.log(JSON.stringify(participation));
                res.end("Thank you for your vote!");
                /*res.redirect('/poll/'+req.params.id);*/ 
            });
            }
            
        });
        }
        
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
    
    function handleError(req,res,err){
        res.render('error',{
                            error:err,
                            message:""
                            });
    }
};