function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}

function doGet(request){
// 'https://script.google.com/macros/s/AKfycbwMW1HqpVfoCjJpq6X6eLf8X7FjUgMSW_9TmqRgTSMY92wLGSYj/exec?id=124&timestamp=1435708800&plan=3',


 var username=null;
 var timestamp=null;
 var planvalue=null;
  if(request.parameter.id!=null){
  var username=request.parameter.id;
  username=parseInt(username,10);
  }
  if(request.parameter.timestamp!=null){
  var timestamp=request.parameter.timestamp;
  timestamp=parseInt(timestamp,10);
  }
  
  if(request.parameter.plan!=null){
  var planvalue=request.parameter.plan;
  planvalue=parseInt(planvalue,10);
  }

  
    
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("JSON_SHEET");
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  var sheets=[];
  for(var i=0;i<data.length;i++){
  sheets.push(data[i][0]);

  }
  //  Logger.log(sheets);
  

  
  
  
    for each(var sh in sheets){
    Logger.log(sh)
    var sheetName=sh;
    if(sheetName.indexOf('_')>0){
    Logger.log("chec")
      var index=sheetName.indexOf('_');
      var newName=sheetName.slice(index+1,sheetName.length);
      Logger.log(newName)
      if(newName==username){
      Logger.log("check2")
        username=sheetName;
        Logger.log(username);
      }
    }
   }
   
   if(username!=null){
   Logger.log("Correct user name")
   for(var j=0;j<data.length;j++){
     if(data[j][0]===username){
     Logger.log("Got value based on correct user name")
   var  jsonvalue= data[j][1];
     }
  }
  // if username is there, but we could'nt find their respective sheet in our sheet DB
if(typeof jsonvalue==='undefined'){
    username=null; 
    Logger.log("username reset")
  }
   
  
  }if(username===null && timestamp!=null){
    if(planvalue===1){
    Logger.log("in plan 1")
    for(var j=0;j<data.length;j++){
     if(data[j][0]==="1month"){
       var  jsonvalue= data[j][1];
       jsonvalue=changeDate(jsonvalue,timestamp);
     }
     // jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
     
    }
    
     else if(planvalue===3){
       Logger.log("in plan 3")
    for(var j=0;j<data.length;j++){
       if(data[j][0]==="3month"){
         var  jsonvalue= data[j][1];
         jsonvalue=changeDate(jsonvalue,timestamp);
         Logger.log(jsonvalue)
       }
     
      //jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
    
    }
    
     else if(planvalue===6){
       Logger.log("in plan 6")
       for(var j=0;j<data.length;j++){
         if(data[j][0]==="6month"){
          var  jsonvalue= data[j][1];
          jsonvalue=changeDate(jsonvalue,timestamp);
          
          }
        // Logger.log(jsonvalue);
       //  jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
    
    }
    
  } else if(username===null&&timestamp===null&&planvalue===null) {
    Logger.log("everything failed...so final")
   for(var j=0;j<data.length;j++){
         if(data[j][0]==="default"){
          var  jsonvalue= data[j][1];
          }
        // Logger.log(jsonvalue);
        // jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
        
     }
  
//  return jsonvalue;
  // write code to return default sheet with default date
  }
    
  
  
//return jsonvalue;
  
  
   return ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
  

}

function changeDate(jsonvalue,timestamp){
Logger.log("in change value")
var d= new Date(timestamp*1000); // just some date for calculation
var formattedDate2=Utilities.formatDate(d, "IST", "yyyy/MM/dd");

 var formattedDate1 = new Date(formattedDate2);
 

 

  
 jsonvalue=JSON.parse(jsonvalue);
 
 var startDatePrev=0;
for(var i=0;i<jsonvalue.timeline.date.length;i++){
//var tempStartPrev=jsonvalue.timeline.date[i-1].startDate;

//var tempStartPrev=jsonvalue.timeline.date[i-1].startDate;

var tempStart=jsonvalue.timeline.date[i].startDate;
var tempEnd=jsonvalue.timeline.date[i].endDate;
var indexPos=tempStart.indexOf('_');
var dateToAdd=tempStart.slice(0,indexPos);


var hoursToAdd=tempStart.slice(indexPos+1,tempStart.length);
dateToAdd=parseInt(dateToAdd,10);
startDatePrev=parseInt(startDatePrev,10);
if(startDatePrev!=dateToAdd){
Logger.log(startDatePrev)
Logger.log(dateToAdd)
  startDatePrev=dateToAdd;
  Logger.log(startDatePrev)
  Logger.log("check")
 var result = parseInt(dateToAdd,10);
 var date_result=parseInt(formattedDate1.getDate(),10);
 dateToAdd=result+date_result;

formattedDate1.setDate(dateToAdd);

}

formattedDate1.setHours(hoursToAdd);
//}else{
//formattedDate1.setDate(formattedDate1.getDate());
//}

var newDate=formattedDate1.getFullYear()+','+(formattedDate1.getMonth()+1)+','+formattedDate1.getDate()+','+formattedDate1.getHours()+','+formattedDate1.getMinutes()+','+formattedDate1.getSeconds();

jsonvalue.timeline.date[i].startDate=newDate;
jsonvalue.timeline.date[i].endDate=newDate;
jsonvalue.timeline.usernamecheck='false';

}

return JSON.stringify(jsonvalue);



}
