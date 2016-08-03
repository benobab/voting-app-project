# Voting App Project
### User stories 
**Authenticated User**
- [x] As an authenticated user, I can keep my polls and come back later to access them. 
- [ ] As an authenticated user, I can share my polls with my friends.
- [ ] As an authenticated user, I can see the aggregate results of my polls.
- [x] As an authenticated user, I can delete polls that I decide I don't want anymore.
- [x] As an authenticated user, I can create a poll with any number of possible items.
- [ ] As an authenticated user, if I don't like the options on a poll, I can create a new option.

**Unauthenticated User**
- [x] As an unauthenticated or authenticated user, I can see and vote on everyone's polls.
- [ ] As an unauthenticated or authenticated user, I can see the results of polls in chart form. (This could be implemented using Chart.js or Google Charts.)

### Tasks
- [x] Initialise the project 
- [x] Create mongo database on mongolab
- [x] Create project on twitter to be able to log into the project (and share it in the future)
- [x] Comment other sign in / sign up way (facebook / google / email) for now
- [x] Create the models 
- [x] Create the template (with a custom menu according to the authentication) //Did it with middleware and pass a variable into the session
- [x] Mobile menu collapsing
- [x] Init the routes
- [x] Separate routes according to the models concerned
- [ ] Detail of a poll
- [ ] Be able to vote
- [ ] Be able to add a custom option
- [ ] Avoid reloading the whole page each time we try to vote
- [ ] Check if someone has already voted (ip address OR twitter id)
- [ ] Display chart results
- [ ] Add tests ?