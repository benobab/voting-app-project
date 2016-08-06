var Poll = require('../models/poll');
var Answer = require('../models/answer');
var Participation = require("../models/participation");

function PollRepository(){
    this.getAllPolls = getAllPolls;
    this.findById = getPollById;
    this.getPollsOfUser = getPollsOfUser;
    this.getAnswers = getAnswersForPoll;
    this.deletePollById = deletePollById;
    this.hasAlreadyAnsweredIp = checkHasAlreadyAnsweredIp;
    this.hasAlreadyAnswered = checkHasAlreadyAnswered;
}

//==============================================================================
/*Get all existing Polls by id (without answers) - callback(err,data)*/
/*Data structure : polls:[poll]*/
//==============================================================================
function getAllPolls(callback){
    Poll.find({},function(err,polls){
                if(err){
                    callback(err);
                }
                callback(null,polls);
            });
}

//==============================================================================
/*Get a Poll by id including its answers - callback(err,data)*/
/*Data structure : {poll:poll,answers:answers}*/
//==============================================================================
function getPollById(id_poll,callback){
    Poll.findById(id_poll,function(err,poll){
            if(err){
                    callback(err);
                    return;
                }
            console.log(poll);
            //Now that we found the poll, we need its answers
            getAnswersForPoll(poll._id,function(err,data){
                if(err){
                    callback(err);
                    return;
                }
                //Success
                callback(null,{
                    poll:poll,
                    answers:data.answers
                });
            });
       });
}

//==============================================================================
/*Get the polls of a specific user - callback(err,polls)*/
/*Data structure :{polls:[polls]}*/
//==============================================================================
function getPollsOfUser(id_user,callback){
    Poll.find({id_creator:id_user},function(err,polls){
           if(err){
                callback(err);
                return;
            }
            callback(null,{polls:polls});
       });
}

//==============================================================================
/*Get the answers of a poll - callback(err,data)*/
/*Data structure :{answers:answers}*/
//==============================================================================
function getAnswersForPoll(id_poll,callback){
    Answer.find({id_poll:id_poll},function(err,answers){
                if(err){
                    callback(err);
                    return;
                }
                callback(null,{answers:answers});
            });
}

//==============================================================================
/*Delete a Poll by id - callback(err)*/
//==============================================================================
function deletePollById(id_poll,id_user,callback){
    Poll.findById(id_poll,function(err, poll) {
            if(err){
                callback(err);
                return;
            }
            //Check that the current user is the owner of this poll
            else if(poll.id_creator === id_user) {
                poll.remove(function(err){
                   if(err){
                        callback(err);
                        return;
                    }
                   callback(null);
                });
            }
       });
}

//==============================================================================
/*Chek if an unauthenticated user has already answered to a poll (with its IP address)
- callback(err,{hasAnswered:Bool,message:String})*/
//==============================================================================
function checkHasAlreadyAnsweredIp(id_poll,ip_address,callback){
    
}

//==============================================================================
/*Chek if an authenticated user has already answered to a poll (with id_user)
- callback(err,{hasAnswered:Bool,message:String})*/
//==============================================================================
function checkHasAlreadyAnswered(id_poll,id_user,callback){
    Participation.find({id_poll:id_poll,id_user:id_user},function(err, participation) {
            if(err){
                callback(err);
            }
            if(participation.length){
                //Send a message saying that you can't vote twice
                console.log("A participation already exists");
                callback(null,{message:"You already voted",hasAnswered:true});
            }else{
                callback(null,{message:"You can vote",hasAnswered:false});
            }
    });
}

module.exports = PollRepository;