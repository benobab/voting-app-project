var poll = require('../models/poll');

function PollRepository(){
    this.findById = getPollById;
    this.getAnswers = getAnswersForPoll;
    this.deletePollById = deletePollById;
}

function getPollById(id,callback){
    
}

function getAnswersForPoll(id,callback){
    
}

function deletePollById(id,callback){
    
}