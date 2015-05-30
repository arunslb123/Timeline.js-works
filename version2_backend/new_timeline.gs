function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}


  
/**
 * doGet
 */
function doGet7(request){
  
  var sheets_timeline=["1month","3month","6month","gopi_123","default"];
  
 var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  
  for each( var s in sheets_timeline){
  var sheet = ss.getSheetByName(s);
  ss.setActiveSheet(sheet);
  var output= updateFillJson(s);
  Logger.log(output)
    
    
  var ss_jsonsheet = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet_jsonsheet = ss_jsonsheet.getSheetByName("JSON_SHEET");
  ss_jsonsheet.setActiveSheet(sheet_jsonsheet);
  var data_jsonsheet = sheet_jsonsheet.getDataRange().getValues();
  for(var i=0;i<data_jsonsheet.length;i++){
  if(data_jsonsheet[i][0]===s){
     var stringFormat='B'+(i+1); // this is because, spreadsheet represent as B1 and not B0
      var range2=sheet_jsonsheet.getRange(stringFormat);
        range2.clearContent();
         range2.setValue(output);
  }
}
}
 
//    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
//    var sheet = ss.getSheetByName(username);
//    ss.setActiveSheet(sheet);
//    var timestamp="1432791650";
//    var outputJson= makeTask(username,timestamp);  
//  
//  Logger.log(outputJson);
//  return outputJson;
  //makeJson();
}

function updateFillJson(s){
   var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(s);
  ss.setActiveSheet(sheet);
  var output=makeTask(s);
  //Logger.log(output);
  return output;
  
  
  
}


// This function get task and date details from the spreadsheet

function makeTask(sheetname){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(sheetname);
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
   
//now I just hard coded the values
// var task=getTask();
  var task=[6,11,16,21];
  var outputJson= getData(task,sheetname);
//  Logger.log(outputJson);
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
function getData(task,sheetname){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(sheetname);
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  var startFormat=['Begin Date','Task','End Date','Text','Asset'];
  var allData=[];
  allData.push(startFormat);
  
  for(i=2;i<data.length;i++){
    var count=0;
    var duration=0;
   for each(var j in task){
      if(data[i][j]!=''){
          count=count+1;
          var singleData=[];
          var oldFormatDate = data[i][0];
          
        if(count>3){
          duration=9;
        }
         
        
        
        // adding time in min in front of task
        
        var taskText=data[i][j];
        taskText=minutesToStr(data[i][j+1]*60)+taskText;
        // To check if the date is in date format or integer. For 1 month, 3 month and 6 month sheets, date format will be in integer.
        if (oldFormatDate === parseInt(oldFormatDate, 10)){
          Logger.log("True"+oldFormatDate)
          singleData.push(oldFormatDate+'_'+duration); // we've to delete this date with new date based on timestamp of the user.
        }else{
        var newDate= formatDate(oldFormatDate,duration);
      //  Logger.log(newDate);
        singleData.push(newDate);
        }
        singleData.push(taskText);
       // Logger.log(data[i][j]);
          if (oldFormatDate === parseInt(oldFormatDate, 10)){
          singleData.push(oldFormatDate+'_'+duration);
        }else{
        var newDate= formatDate(oldFormatDate,duration);
        Logger.log(newDate);
        singleData.push(newDate);
        }
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
  var timelineObj = function (headline,type,date,era,text,usernamecheck)
    {
        this.headline=headline;
        this.type=type;
        this.text=text;
        this.date=date;
        this.era=era;
        this.usernamecheck=usernamecheck;
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
    var swTimeline = new timelineObj('A New Timeline','default',dates,eras,'Text','true');
    var jsonTimeline = new jsonObj(swTimeline);
    //Logger.log(JSON.stringify(jsonTimeline));
  var outputJson=JSON.stringify(jsonTimeline);
  //  var outputJson = ContentService.createTextOutput(JSON.stringify(jsonTimeline)).setMimeType(ContentService.MimeType.JSON);
  //Logger.log(JSON.stringify(outputJson.setMimeType(ContentService.MimeType.JSON)));
  
    return outputJson;
}



/*
Timeline js date format is month/date/year (5/20/2015) which is 20th may 2015.
Entrayn Date format from the given spreadsheet : Start Date: Tue May 12 2015 00:00:00 GMT+0530 (IST)
This function converts the entrayn format date to timeline.js date format.
*/

function formatDate(oldFormat,duration){
  Logger.log("in format date");
  var formattedDate = Utilities.formatDate(oldFormat, "IST", "yyyy,MM,dd");
//  Logger.log(formattedDate);
//  Logger.log(duration);
  var formattedDate1 = new Date(oldFormat);
  formattedDate1.setHours(duration);
  var dateValue=formattedDate1.getDate();
//  if(username==="default"){
//  formattedDate1.setDate(dateValue+diffBetweenDates);
//  }
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
