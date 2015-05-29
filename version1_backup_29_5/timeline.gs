function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}


  
/**
 * doGet
 */
function doGet(request){
  
  var username=null;
  if(request.parameter.id!=null){
   var getID=request.parameter.id;
   var ss = SpreadsheetApp.openById('1Jfa8UOVHZ_A7AA3t4iX8Nt8eJY3hux5ZByO1jx2LDLA');
   var sheets = ss.getSheets();
    
   for each(var sh in sheets){
    var sheetName=sh.getSheetName();
    if(sheetName.indexOf('_')>0){
      var index=sheetName.indexOf('_');
      var newName=sheetName.slice(index+1,sheetName.length);
      if(newName===getID){
        username=sheetName;
      }
    }
   }
  }
  if(username===null){
    username="default";
  }
    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName(username);
    ss.setActiveSheet(sheet);
    var timestamp="1432791650";
    var outputJson= makeTask(username,timestamp);  
  
  Logger.log(outputJson);
  return outputJson;
  //makeJson();
}


// This function get task and date details from the spreadsheet

function makeTask(username,timestamp){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(username);
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
   
//now I just hard coded the values
// var task=getTask();
  var task=[6,11,16,21];
  var outputJson= getData(task,username,timestamp);
  Logger.log(outputJson);
  return outputJson;
}

// This function generate the task column index from the spreadsheet
function getTask(){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("default");
  ss.setActiveSheet(sheet);
  var data=sheet.getDataRange().getValues();
  var task=[];
  for(var index=0;index<50;index++){
    var str=data[0][index];
    if(/Task/.test(str)|| /task/.test(str)){
      task.push(index);
     }
   }
  return task;
 }
  

// This function generate the task data
function getData(task,username,timestamp){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(username);
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  var startFormat=['Begin Date','Task','End Date','Text','Asset'];
  var allData=[];
  allData.push(startFormat);
  
   var dateCounter=0;
   var diffBetweenDates=0;
  for(i=2;i<data.length;i++){
    var count=0;
    var duration=0;
   for each(var j in task){
      if(data[i][j]!=''){
          count=count+1;
          var singleData=[];
          var oldFormatDate = data[i][0];
        if(dateCounter===0){
          diffBetweenDates=alterChangeValue(data[i][0],timestamp);
          dateCounter=dateCounter+1;
        }
          
        if(count>3){
          duration=9;
        }
         
        var newDate= formatDate(oldFormatDate,duration,diffBetweenDates,username);
        Logger.log(newDate);
        
        // adding time in min in front of task
        
        var taskText=data[i][j];
        taskText=minutesToStr(data[i][j+1]*60)+taskText;
      //  Logger.log(newDate);
        singleData.push(newDate);
        singleData.push(taskText);
       // Logger.log(data[i][j]);
        singleData.push(newDate);
        singleData.push(taskText);
        var taskType=data[i][j-2];
        var thumbnail;
        if(taskType==="A"){
          thumbnail="http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-10/24/Test-paper-icon.png";
          
        }else if(taskType==="L"){
          thumbnail="http://icons.iconarchive.com/icons/kyo-tux/soft/32/Tutorial-icon.png";
        }else if(taskType==="R"){
          thumbnail="https://cdn2.iconfinder.com/data/icons/diagona/icon/16/164.png";
        }
        singleData.push(thumbnail);
        
        allData.push(singleData);
        
      }
    }
  }
 //  Logger.log(allData);
var outputJson=  generateFinalJson(allData);
  return outputJson;
}

// This function gets all the array data and generate the json format.

function generateFinalJson(data){
  //create timeline json object
  var jsonObj = function(timeline){
  this.timeline=timeline;
    }
  var timelineObj = function (headline,type,date, era,text)
    {
        this.headline=headline;
        this.type=type;
        this.text=text;
        this.date=date;
        this.era=era;
    }
  var dates= new Array();

  var dateObj =  function(startDate, endDate, headline,text,asset)
            {
                this.startDate=startDate;
                this.endDate=endDate;
                this.headline=headline;
                this.text=text;
                this.asset=asset;
            }
  
  // lines added for asset object- for thumbnail image
  
  var assetObj=function(thumbnail){
    this.thumbnail=thumbnail;
  }

  var eras = new Array();

  var eraObj= function(startDate, endDate, headline,text)
    {
            this.startDate=startDate;
            this.endDate=endDate;
            this.headline=headline;
            this.text=text;
        }
  
   //get position of an element from the data array
   var pos = function (el){
   var colHeaders = data[0]; // reading header row
   return colHeaders.indexOf(el) //return position of el
    }

    for (var i=1; i<data.length; i++){
        beginDate=data[i][pos('Begin Date')];
        endDate=data[i][pos('End Date')];
        headline=data[i][pos('Task')];
        text=data[i][pos('Text')];
        asset=data[i][pos('Asset')];
        var assetAdd=new assetObj(asset);
        var projectDate = new dateObj(beginDate,endDate,headline,text,assetAdd);
        dates.push(projectDate);
    }
//  Logger.log(dates);

    var swEra = new eraObj('2000','2020','era headline','era text');
    eras.push(swEra);

    //build json obj
    var swTimeline = new timelineObj('A New Timeline','default',dates,eras,'Text');
    var jsonTimeline = new jsonObj(swTimeline);
    var jsonTimeline2={"timeline":{"headline":"A New Timeline","type":"default","text":"Text","date":[{"startDate":"2015,5,28,0,0,0","endDate":"2015,5,28,0,0,0","headline":"2h: Study \"Very Easy words 1\"","text":"2h: Study \"Very Easy words 1\"","asset":{"thumbnail":"http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-10/24/Test-paper-icon.png"}},{"startDate":"2015,5,28,0,0,0","endDate":"2015,5,28,0,0,0","headline":"6m: Test on \"Very Easy words 2\" - Test 1","text":"6m: Test on \"Very Easy words 2\" - Test 1","asset":{"thumbnail":"http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-10/24/Test-paper-icon.png"}},{"startDate":"2015,5,28,0,0,0","endDate":"2015,5,28,0,0,0","headline":"1h: List out all challenging words from \"Easy\" Lists into Words spreddy","text":"1h: List out all challenging words from \"Easy\" Lists into Words spreddy","asset":{"thumbnail":"https://cdn2.iconfinder.com/data/icons/diagona/icon/16/164.png"}},{"startDate":"2015,5,28,9,0,0","endDate":"2015,5,28,9,0,0","headline":"1h: Argument Essay on Mason River - v1","text":"1h: Argument Essay on Mason River - v1","asset":{"thumbnail":"https://cdn2.iconfinder.com/data/icons/diagona/icon/16/164.png"}},{"startDate":"2015,5,29,0,0,0","endDate":"2015,5,29,0,0,0","headline":"45m: Norman Lewis Sess.1 (Vocabulary Pre-Test)","text":"45m: Norman Lewis Sess.1 (Vocabulary Pre-Test)","asset":{"thumbnail":"http://icons.iconarchive.com/icons/kyo-tux/soft/32/Tutorial-icon.png"}},{"startDate":"2015,5,29,0,0,0","endDate":"2015,5,29,0,0,0","headline":"45m: Norman Lewis Sess.1 (Vocabulary Pre-Test)","text":"45m: Norman Lewis Sess.1 (Vocabulary Pre-Test)","asset":{"thumbnail":"http://icons.iconarchive.com/icons/kyo-tux/soft/32/Tutorial-icon.png"}},{"startDate":"2015,5,31,0,0,0","endDate":"2015,5,31,0,0,0","headline":"6m: Test on \"Very Easy words 3\" - Test 1","text":"6m: Test on \"Very Easy words 3\" - Test 1","asset":{"thumbnail":"http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-10/24/Test-paper-icon.png"}},{"startDate":"2015,5,31,0,0,0","endDate":"2015,5,31,0,0,0","headline":"1h: List out all challenging words from \"Medium\" Lists into Words spreddy","text":"1h: List out all challenging words from \"Medium\" Lists into Words spreddy","asset":{"thumbnail":"https://cdn2.iconfinder.com/data/icons/diagona/icon/16/164.png"}},{"startDate":"2015,6,1,0,0,0","endDate":"2015,6,1,0,0,0","headline":"15m: Download \"Vocabulary.com\" mobile app to your phone","text":"15m: Download \"Vocabulary.com\" mobile app to your phone","asset":{"thumbnail":"https://cdn2.iconfinder.com/data/icons/diagona/icon/16/164.png"}},{"startDate":"2015,6,1,0,0,0","endDate":"2015,6,1,0,0,0","headline":"15m: Revise Critical Reasoning","text":"15m: Revise Critical Reasoning","asset":{"thumbnail":"https://cdn2.iconfinder.com/data/icons/diagona/icon/16/164.png"}},{"startDate":"2015,6,1,0,0,0","endDate":"2015,6,1,0,0,0","headline":"1h: Argument Essay on Mason River - v1","text":"1h: Argument Essay on Mason River - v1","asset":{"thumbnail":"http://icons.iconarchive.com/icons/custom-icon-design/pretty-office-10/24/Test-paper-icon.png"}},{"startDate":"2015,6,2,0,0,0","endDate":"2015,6,2,0,0,0","headline":"1h 15m: <a href=\"http://entrayn.com/galvanize/node/1352/glu/21410/assessment/launch\" target=\"_tab\"> [Go] </a>Practice Test 2 in Arithmetic (23 GRE style questions) - PT2","text":"1h 15m: <a href=\"http://entrayn.com/galvanize/node/1352/glu/21410/assessment/launch\" target=\"_tab\"> [Go] </a>Practice Test 2 in Arithmetic (23 GRE style questions) - PT2","asset":{"thumbnail":"http://icons.iconarchive.com/icons/kyo-tux/soft/32/Tutorial-icon.png"}},{"startDate":"2015,6,2,0,0,0","endDate":"2015,6,2,0,0,0","headline":"45m: <a href=\"http://entrayn.com/galvanize/node/1352/glu/21435/assessment/launch\" target=\"_tab\"> [Go] </a>Practice Test 3 in Arithmetic (10 GRE style questions) - PT3","text":"45m: <a href=\"http://entrayn.com/galvanize/node/1352/glu/21435/assessment/launch\" target=\"_tab\"> [Go] </a>Practice Test 3 in Arithmetic (10 GRE style questions) - PT3","asset":{"thumbnail":"http://icons.iconarchive.com/icons/kyo-tux/soft/32/Tutorial-icon.png"}},{"startDate":"2015,6,2,0,0,0","endDate":"2015,6,2,0,0,0","headline":"36m: <a href=\"http://entrayn.com/galvanize/node/1352/glu/19770/glu/20006\" target=\"_tab\"> [Go] </a>Slides 37 - 53 in Arithmetic","text":"36m: <a href=\"http://entrayn.com/galvanize/node/1352/glu/19770/glu/20006\" target=\"_tab\"> [Go] </a>Slides 37 - 53 in Arithmetic","asset":{"thumbnail":"http://icons.iconarchive.com/icons/kyo-tux/soft/32/Tutorial-icon.png"}}],"era":[{"startDate":"2000","endDate":"2020","headline":"era headline","text":"era text"}]}}
   // Logger.log(jsonTimeline);
    var outputJson = ContentService.createTextOutput(JSON.stringify(jsonTimeline2)).setMimeType(ContentService.MimeType.JSON);
  
    return outputJson;
}



/*
Timeline js date format is month/date/year (5/20/2015) which is 20th may 2015.
Entrayn Date format from the given spreadsheet : Start Date: Tue May 12 2015 00:00:00 GMT+0530 (IST)
This function converts the entrayn format date to timeline.js date format.
*/

function formatDate(oldFormat,duration,diffBetweenDates,username){
  var formattedDate = Utilities.formatDate(oldFormat, "IST", "yyyy,MM,dd");
  Logger.log(formattedDate);
  Logger.log(duration);
  var formattedDate1 = new Date(oldFormat);
  formattedDate1.setHours(duration);
  var dateValue=formattedDate1.getDate();
  if(username==="default"){
  formattedDate1.setDate(dateValue+diffBetweenDates);
  }
  return (formattedDate1.getFullYear()+','+(formattedDate1.getMonth()+1)+','+formattedDate1.getDate()+','+formattedDate1.getHours()+','+formattedDate1.getMinutes()+','+formattedDate1.getSeconds());
}




function minutesToStr(minutes) {  

  
 var hours = Math.floor(Math.abs(minutes) / 60);  
 var minutes = Math.abs(minutes) % 60;  
  
  if(hours>0){
    if(minutes>0){
    return hours +'h '+minutes + 'm: ';
    }else{
      return hours+'h: ';
    }
  }else{
    return minutes+ 'm: ';
  }
  
}

function alterChangeValue(oldFormat,timestamp){
  
  var formattedDate = Utilities.formatDate(oldFormat, "IST", "yyyy,MM,dd");
  var formattedDate1 = new Date(oldFormat);
  // added for changing the date for default users with timestamp
  var newDate=new Date(timestamp*1000);
  var formattedDate2=Utilities.formatDate(oldFormat, "IST", "yyyy/MM/dd");
  newDate=Utilities.formatDate(newDate,"IST","yyyy/MM/dd");
  var date1=formattedDate2.toString();
  var date2 = newDate.toString();
  var diffB=formatDate1(date1,date2);
  return diffB;
}
         
  
/* 
 * add zero to numbers less than 10,Eg: 2 -> 02 
 */  
function leftPad(number) {    
    return ((number < 10 && number >= 0) ? '0' : '') + number;  
}  
  

function formatDate1(date1,date2){
  date1 = new Date(fixDate(date1));
  date2 = new Date(fixDate(date2));
  var diff = (date2-date1)/(1000*60*60*24);
  return(diff);
}

function fixDate(date){  
    var collector = date;
    if (collector.match("/")!=null){
      collector = collector.split("/");
      var myString = [collector[1], collector[2], collector[0]].join("/");
      return myString
    }
  }
