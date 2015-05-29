function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}

function doGet8(request){

 var username=null;
 var timestamp=null;
 var planvalue=null;
  if(request.parameter.id!=null){
  var username=request.parameter.id;
  }
  if(request.parameter.timestamp!=null){
  var timestamp=request.parameter.timestamp;
  }
  
  if(request.parameter.plan!=null){
  var planvalue=request.parameter.plan;
  }

  
    
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("");
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  var sheets=[];
  for(var i=0;i<data.length;i++){
  sheets.push(data[i][0]);

  }
  //  Logger.log(sheets);
  

  
  
  
    for each(var sh in sheets){
    var sheetName=sh;
    if(sheetName.indexOf('_')>0){
      var index=sheetName.indexOf('_');
      var newName=sheetName.slice(index+1,sheetName.length);
      if(newName===username){
        username=sheetName;
        Logger.log(username);
      }
    }
   }
   
   if(username!=null){
   for(var j=0;j<data.length;j++){
     if(data[j][0]===username){
   var  jsonvalue= data[j][1];
     }
  Logger.log(jsonvalue);
  jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
  }
  
  }
  else if(username===null && timestamp!=null){
    if(planvalue===1){
    for(var j=0;j<data.length;j++){
     if(data[j][0]==="1_month"){
       var  jsonvalue= data[j][1];
       jsonvalue=changeDate(jsonvalue,timestamp);
     }
    Logger.log(jsonvalue);
      jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
    }
    
     else if(planvalue===3){
    for(var j=0;j<data.length;j++){
       if(data[j][0]==="3_month"){
         var  jsonvalue= data[j][1];
         jsonvalue=changeDate(jsonvalue,timestamp);
       }
       Logger.log(jsonvalue);
      jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
    }
    
     else if(planvalue===6){
       for(var j=0;j<data.length;j++){
         if(data[j][0]==="6_month"){
          var  jsonvalue= data[j][1];
          jsonvalue=changeDate(jsonvalue,timestamp);
          }
        // Logger.log(jsonvalue);
         jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
    }
  } else {
   for(var j=0;j<data.length;j++){
         if(data[j][0]==="default"){
          var  jsonvalue= data[j][1];
          }
        // Logger.log(jsonvalue);
         jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
     }
  
  
  // write code to return default sheet with default date
  }
    
  
  
  return jsonvalue;


}

function changeDate(jsonvalue,timestamp){
var d= new Date(timestamp*1000); // just some date for calculation
var formattedDate2=Utilities.formatDate(d, "IST", "yyyy/MM/dd");

 var formattedDate1 = new Date(formattedDate2);
 
 Logger.log(formattedDate1)
 

  
 jsonvalue=JSON.parse(jsonvalue);
 
 
for(var i=0;i<jsonvalue.timeline.date.length;i++){
var tempStart=jsonvalue.timeline.date[i].startDate;
var tempEnd=jsonvalue.timeline.date[i].endDate;
var indexPos=tempStart.indexOf('_');
var dateToAdd=tempStart.slice(0,indexPos);
Logger.log(dateToAdd)
var hoursToAdd=tempStart.slice(indexPos+1,tempStart.length);
Logger.log(hoursToAdd)
formattedDate1.setHours(hoursToAdd);
 var result = parseInt(dateToAdd,10);
 var date_result=parseInt(formattedDate1.getDate(),10);
dateToAdd=result+date_result;
Logger.log(dateToAdd)
formattedDate1.setDate(dateToAdd);
var newDate=formattedDate1.getFullYear()+','+(formattedDate1.getMonth()+1)+','+formattedDate1.getDate()+','+formattedDate1.getHours()+','+formattedDate1.getMinutes()+','+formattedDate1.getSeconds();
Logger.log(newDate)
jsonvalue.timeline.date[i].startDate=newDate;
jsonvalue.timeline.date[i].endDate=newDate;

}

return JSON.stringify(jsonvalue);



}
