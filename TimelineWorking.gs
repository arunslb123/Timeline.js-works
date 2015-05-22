function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}

function getSheet(){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Gopi");
  return sheet;
}
  
/**
 * doGet
 */
function doGet(request){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Gopi");
  ss.setActiveSheet(sheet);
  var outputJson= makeTask();  
  return outputJson;
  //makeJson();
}


// This function get task and date details from the spreadsheet

function makeTask(){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Gopi");
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
   
//now I just hard coded the values
// var task=getTask();
  var task=[6,11,16];
 var outputJson= getData(task);
  Logger.log(outputJson);
  return outputJson;
}

// This function generate the task column index from the spreadsheet
function getTask(){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Gopi");
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
function getData(task){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Gopi");
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  var startFormat=['Begin Date','Task','End Date'];
  var allData=[];
  allData.push(startFormat);
  
  
  for(i=2;i<data.length;i++){
    for each(var j in task){
      if(data[i][j]!=''){
          var singleData=[];
          var oldFormatDate=data[i][0];
          var newDate= formatDate(oldFormatDate);
        singleData.push(newDate);
        singleData.push(data[i][j]);
        singleData.push(newDate);
        allData.push(singleData);
       
      
         // Logger.log('Start Date: '+newDate);
       //   Logger.log('Task: '+data[i][j] );
        
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
  var timelineObj = function (headline,date, era)
    {
        this.headline=headline;
      //  this.type=type;
       // this.text=text;
        this.date=date;
        this.era=era;
    }
  var dates= new Array();

  var dateObj =  function(startDate, endDate, headline)
            {
                this.startDate=startDate;
                this.endDate=endDate;
                this.headline=headline;
            }

  var eras = new Array();

  var eraObj= function(startDate, endDate, headline)
    {
            this.startDate=startDate;
            this.endDate=endDate;
            this.headline=headline;
        }
  
   //get position of an element from the data array
   var pos = function (el){
   var colHeaders = data[0]; // reading header row
   return colHeaders.indexOf(el) //return position of el
    }
   // Logger.log(data);

    for (var i=1; i<data.length; i++){
        beginDate=data[i][pos('Begin Date')];
        endDate=data[i][pos('End Date')];
        headline=data[i][pos('Task')];
       // text=data[i][pos('Food')];
     //   tag=data[i][pos('Qty')];
        var projectDate = new dateObj(beginDate,endDate,headline);
        dates.push(projectDate);
    }
//  Logger.log(dates);

    var swEra = new eraObj('2000','2020','era headline');
    eras.push(swEra);

    //build json obj
    var swTimeline = new timelineObj('A New Timeline',dates,eras);
    var jsonTimeline = new jsonObj(swTimeline);
  // var jsonTimeline = JSON.stringify(jsonTimeline);
   // Logger.log(jsonTimeline);
    //loadData(json);
    var outputJson = ContentService.createTextOutput(JSON.stringify(jsonTimeline)).setMimeType(ContentService.MimeType.JSON);
    return outputJson;
}



/*
Timeline js date format is month/date/year (5/20/2015) which is 20th may 2015.

Entrayn Date format from the given spreadsheet : Start Date: Tue May 12 2015 00:00:00 GMT+0530 (IST)

This function converts the entrayn format date to timeline.js date format.

*/

function formatDate(oldFormat){
  var formattedDate = Utilities.formatDate(oldFormat, "IST", "MM-dd-yyyy");
  if(formattedDate[0]==='0'){
   formattedDate= formattedDate.slice(1,formattedDate.length+1);
  }
   return formattedDate;
}

  
  
  
