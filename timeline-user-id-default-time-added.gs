function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}


  
/**
 * doGet
 */
function doGet(request){
  
  var username=null;
 
 Logger.log("main2");
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
  Logger.log(getID); 
  if(username===null){
    username="default";
  }
    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName(username);
    ss.setActiveSheet(sheet);
    var outputJson= makeTask(username);  
  
  Logger.log(outputJson);
  return outputJson;
  //makeJson();
}


// This function get task and date details from the spreadsheet

function makeTask(username){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(username);
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
   
//now I just hard coded the values
// var task=getTask();
  var task=[6,11,16,21];
  var outputJson= getData(task,username);
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
function getData(task,username){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName(username);
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  var startFormat=['Begin Date','Task','End Date','Text'];
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
         
        var newDate= formatDate(oldFormatDate,duration);
        
        // adding time in min in front of task
        
        var taskText=data[i][j];
        taskText='['+data[i][j+1]*60+' mins'+']'+taskText;
      //  Logger.log(newDate);
        singleData.push(newDate);
        singleData.push(taskText);
        Logger.log(data[i][j]);
        singleData.push(newDate);
        singleData.push(taskText);
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

  var dateObj =  function(startDate, endDate, headline,text)
            {
                this.startDate=startDate;
                this.endDate=endDate;
                this.headline=headline;
                this.text=text;
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
        var projectDate = new dateObj(beginDate,endDate,headline,text);
        dates.push(projectDate);
    }
//  Logger.log(dates);

    var swEra = new eraObj('2000','2020','era headline','era text');
    eras.push(swEra);

    //build json obj
    var swTimeline = new timelineObj('A New Timeline','default',dates,eras,'Text');
    var jsonTimeline = new jsonObj(swTimeline);
    Logger.log(jsonTimeline);
    var outputJson = ContentService.createTextOutput(JSON.stringify(jsonTimeline)).setMimeType(ContentService.MimeType.JSON);
  
    return outputJson;
}



/*
Timeline js date format is month/date/year (5/20/2015) which is 20th may 2015.
Entrayn Date format from the given spreadsheet : Start Date: Tue May 12 2015 00:00:00 GMT+0530 (IST)
This function converts the entrayn format date to timeline.js date format.
*/

function formatDate(oldFormat,duration){
  var formattedDate = Utilities.formatDate(oldFormat, "IST", "yyyy,MM,dd");
  Logger.log(formattedDate);
  Logger.log(duration);
  var formattedDate1 = new Date(oldFormat);
  formattedDate1.setHours(duration);
  Logger.log("check"+formattedDate1);
  Logger.log(formattedDate1.getFullYear());
   return (formattedDate1.getFullYear()+','+formattedDate1.getMonth()+1+','+formattedDate1.getDate()+','+formattedDate1.getHours()+','+formattedDate1.getMinutes()+','+formattedDate1.getSeconds());
}
