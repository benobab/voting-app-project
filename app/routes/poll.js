module.exports = function(app){
    
    var Poll = require("../models/poll");
    var Answer = require("../models/answer");
    var Participation = require("../models/participation");
    var PollRepository = require("../repositories/pollRepository");
    //==========================================================================
    //Poll =====================================================================
    //==========================================================================
    app.get('/poll/all',function(req,res){
        var repo = new PollRepository();
        repo.getAllPolls(function(err,polls){
            if(err) throw err;
            res.status(200).render('index',{polls:polls});
        });
    });
    
    app.get('/poll/my',isLoggedIn,function(req,res){
        var repo = new PollRepository();
        repo.getPollsOfUser(req.user.twitter.id,function(err,polls){
            if(err) 
            throw err;
           res.status(200).render('mypolls',polls);
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
    });
    
    app.get('/poll/delete/:id',isLoggedIn,function(req, res) {
        var repo = new PollRepository();
        repo.deletePollById(req.params.id,req.user.twitter.id,function(err){
           if(err){
               res.render('mypolls',{err:err});
           }else{
               res.redirect('/poll/my');
           }
        });
    });
    
    app.get('/poll/:id',function(req,res){
        var repo = new PollRepository();
        repo.findById(req.params.id,function(err,poll){
            if(err){
                handleError(req,res,err);
                return;
            }else{
                res.render('detail',poll);
            }
        })
    });
    
    app.post('/poll/:id/add',function(req, res) {
        console.log("Trying to add custom option");
        if(!req.isAuthenticated()){
            res.end(JSON.stringify({message:"You need to be authenticated to add an option"}));
        }
        //Check that he hasn't answered yet
        var repo = new PollRepository();
        var id_poll = req.params.id;
        var id_user = req.user.twitter.id;
        console.log("Check if the user already answered");
        repo.hasAlreadyAnswered(id_poll,id_user,function(err,data){
            if(err){
                res.end(err);
            }
            if(data.hasAnswered){
                res.end(JSON.stringify(data));
            }else{
                console.log("Geting the new option from the body");
                console.log("Body: "+req.body);
                //Get the body to add the answer
                var customOption = req.body.customoption;
                if(customOption){ // Be sure it is defined and not null
                    var answer = new Answer({
                        title: customOption,
                        id_poll:id_poll
                    });
                    console.log("Creating the answer: "+ answer);
                    repo.postCustomAnswer(id_poll,answer,function(err,data){
                        console.log("Posting the answer with data: "+data);
                       if(err){
                           res.end(err);
                       }else{
                           res.end(JSON.stringify(data));
                       } 
                    });
                }
            }
        });
    });
    
    app.post('/poll/:id/answer/',function(req,res){
        var repo = new PollRepository();
        //parse the body to know the id of the answer selected
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
                res.end(JSON.stringify({message:"You already voted",refresh:false}));
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
                res.end(JSON.stringify({message:"Thank you for your vote!",refresh:true}));
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
                res.end(JSON.stringify({message:"You already voted",refresh:false}));
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
                res.end(JSON.stringify({message:"Thank you for your vote!",refresh:true}));
                /*res.redirect('/poll/'+req.params.id);*/ 
            });
            }
            
        });
        }
        
    });
    
    
    app.get('/poll/:id/dataset',function(req, res) {
       
       var answers=[];
       var counts=[];
       var colors=[];
       var hoverbackgroundColor=[];
       //Get the answers for this poll
       Answer.find({id_poll:req.params.id},function(err,ans){
                if(err) throw err;
                console.log("Trying to send right dataset and actually these are the answers: "+ ans);
                ans.forEach(function(answer,index,array){
                    console.log('We are foreaching through the answers, the actual one is: '+ answer.title);
                    answers.push(answer.title);
                    //Get the participation count foreach answer
                    Participation.count({id_answer:answer._id},function(err,count){
                        if(err) throw err;
                        console.log('Participation count: ' + count);
                        counts.push(count);
                        colors.push(getRandomColor());
                        hoverbackgroundColor.push(getRandomColor());
                        if (index === array.length - 1) {
                            var dataset = {
                                labels:answers,
                                datasets: [
                                    {
                                        data:counts,
                                        backgroundColor:colors,
                                        hoverBackgroundColor: hoverbackgroundColor
                                    }]
                            };
                            console.log(JSON.stringify(dataset));
                            res.end(JSON.stringify(dataset));
                        }
                    }); 
                });
                
            });
       
    });
    
    //====================================================================================================
    //Helper to generate random color ====================================================================
    //====================================================================================================
    function getRandomColor() {
        var letters = '0123456789ABCDEF'.split('');
        var color = '#';
        for (var i = 0; i < 6; i++ ) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }
    
    
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