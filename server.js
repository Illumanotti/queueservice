var express = require("express");
 var app = express();
 var bodyParser=require('body-parser');
 var cookieParser=require('cookie-parser');
 var session=require('express-session');
// var mysql= require('mysql');
 var defaultTries=3;
 var randomlyAddUsersEvery=2000;
 var randomlyRemoveUsersEvery=10000;
 var branchQueue={Woodlands:[],UpperThomson:[],SixthAvenue:[],SerangoonGarden:[],JEM:[],NEX:[],ClementiMall:[],HollandVillage:[],JurongSME:[],JurongExpress:[],ION:[],MandarinGallery:[],PlazaSing:[],BatteryRd:[],MarinaBay:[],Vivocity:[],Tampines:[],MarineParade:[],Bedok:[]};
 
 var priorityQueue={Woodlands:[],UpperThomson:[],SixthAvenue:[],SerangoonGarden:[],JEM:[],NEX:[],ClementiMall:[],HollandVillage:[],JurongSME:[],JurongExpress:[],ION:[],MandarinGallery:[],PlazaSing:[],BatteryRd:[],MarinaBay:[],Vivocity:[],Tampines:[],MarineParade:[],Bedok:[]};
 
 var nextInQueue={Woodlands:0,UpperThomson:0,SixthAvenue:0,SerangoonGarden:0,JEM:0,NEX:0,ClementiMall:0,HollandVillage:0,JurongSME:0,JurongExpress:0,ION:0,MandarinGallery:0,PlazaSing:0,BatteryRd:0,MarinaBay:0,Vivocity:0,Tampines:0,MarineParade:0,Bedok:0};
 /*Use Session*/
 app.use(bodyParser());
 app.use(cookieParser());
//app.use(session({secret: '1234567890QWERTY'}));

/*app.set('views', __dirname + '/views')
app.set('view engine', 'jade')*/


 /* serves main page */

 
 /*====================Process Login
 app.post("/processLogin",function(req,res){
	req.session.user=req.body.user
	res.render('loginSuccess',{user:req.body.user});
 });

 =============== serves all the static files 
 app.get(/^(.+)$/, function(req, res){ 
     console.log('static file request : ' + req.params[0]);
	 if(req.params[0]=='/logout'){
		 req.session=null;
		res.sendfile('static/login.html');
	 }else{
     res.sendfile( __dirname +'/static/'+ req.params[0]); 
	 }
 });
 */
 
 app.get("/insertIntoPriority",function(req,res){
	var branch=req.query.branch;
	var id=req.query.id;
	
	var queueNum=0;
	//get latest queueNum
	if(branchQueue[branch].length>0){
		queueNum=branchQueue[branch][length-1].queueNum+1;
	}
	priorityQueue[branch].push({id:id,start:new Date(),totalTries:defaultTries,queueNum:queueNum});
	res.send("you are queued at: "+priorityQueue[branch].length-1);
	
 });
 
 app.get("/getWaitingTime",function(req,res){
	 var allTiming=[];
	 for(var branch in branchQueue){
		 if(branchQueue.hasOwnProperty(branch)){
				var message="";
				 if(branchQueue[branch].length>0){
				 var currentBranch=branchQueue[branch];
				 
				 var startTime=currentBranch[currentBranch.length-1].start;
				 var duration=currentBranch[currentBranch.length-1].duration;
				 
				 var expectedStartTime=new Date(startTime.getTime()+duration*60000);
				 var currentTime=new Date();
				 
				 var diff=expectedStartTime-currentTime;
				 
				 var msec=diff;
				 var hh = Math.floor(msec / 1000 / 60 / 60);
				 msec -= hh * 1000 * 60 * 60;
				 var mm = Math.floor(msec / 1000 / 60);
				 
				 
				 if(hh==0){
					 message=mm+" min";
				 }else{
					 message=hh+" hr /"+mm+" min";
				 }
				 }else{
					 message="No Wait Time";
				 }
				 
				 allTiming.push({branch:branch,message:message});
		 }
	 }
	 res.send(allTiming);
	 
 });

 //randomly add people into the branch Queue every few seconds
 setInterval(function(){
	var id=Math.floor(Math.random() * 10000000) + 1;
	 var keys = Object.keys(branchQueue);
	 var randomBranchName=keys.length * Math.random() << 0;
	var branch=branchQueue[keys[randomBranchName]];
	var queueNum=nextInQueue[keys[randomBranchName]]+1;
	nextInQueue[keys[randomBranchName]]=nextInQueue[keys[randomBranchName]]+1;
	
	var startTime=new Date();
	
	if(branch.length>0){
		var lastPerson=branch[branch.length-1];
		startTime=new Date(lastPerson.start.getTime()+lastPerson.duration*60000);
	}
	var duration = Math.floor(Math.random()*30)+1;
	branch.push({id:id,start:startTime,duration:duration,queueNum:queueNum});
 },randomlyAddUsersEvery);
 
 //randomly remove users every few seconds
  setInterval(function(){
	var id=Math.floor(Math.random() * 10000000) + 1;
	 var keys = Object.keys(branchQueue);
	 var randomBranchName=keys.length * Math.random() << 0;
	var branch=branchQueue[keys[randomBranchName]];
	if(branch.length>0){
		console.log("Remove user from "+keys[randomBranchName]);
	}
 },randomlyRemoveUsersEvery);
 

 
app.get("/popFromPriority",function(req,res){
	var branch=req.query.branch;
	var id=req.query.id;
 });

 var port = process.env.PORT || 8000;
 app.listen(port, function() {
   console.log("Listening on " + port);
 });
 
