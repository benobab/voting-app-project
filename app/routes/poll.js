module.exports = function(app){
    //==========================================================================
    //Poll =====================================================================
    //==========================================================================
    app.get('/poll/all',function(req,res){
        //Get all poll
    });
    app.get('/poll/new',isLoggedIn,function(req,res){
        res.redirect('create');
    });
    app.post('/poll/new',isLoggedIn, function(req,res) {
        //Get the poll from the req
        //Insert it into the database
       //If success -> redirect to the poll details
       //If fails -> display an error message in the same page
    });
    app.get('/poll/:id',function(req,res){
       //Get the poll from the req
        //Insert it into the database
       //If success -> redirect to the poll details
       //If fails -> display an error message in the same page
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