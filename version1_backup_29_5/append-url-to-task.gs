function setUp() {
 ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet().getId());
}
  
/**
 * doGet
 */
function doGet2(request){
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Master");
  ss.setActiveSheet(sheet);
  appendURL();

}

function appendURL(){
  
  var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
  var sheet = ss.getSheetByName("Master");
  ss.setActiveSheet(sheet);
  var data = sheet.getDataRange().getValues();
  
  
 
  for(i=2;i<data.length;i++){
    var url=data[i][2];
     var updateValue=data[i][1];
    if(url.indexOf('http')>=0){
      //Logger.log(url);
      var stringFormat='B'+(i+1); // this is because, spreadsheet represent as B1 and not B0
      Logger.log(stringFormat);
      if(data[i][1].indexOf("</a>")){
         Logger.log("Inside");
         var range2=sheet.getRange(stringFormat);
         var start=data[i][1].lastIndexOf("</a>")+4;
         Logger.log(start);
         var removeAttributeTask=data[i][1].slice(start, data[i][1].length);
         Logger.log(removeAttributeTask);
         updateValue=removeAttributeTask;
         range2.clearContent();
         range2.setValue(removeAttributeTask);
    }
     
      var range = sheet.getRange(stringFormat);
      var value='<a href="'+url+'" target="_tab"> [Go] </a>'+updateValue;
      Logger.log(value);
      range.setValue(value); 
    }
  }
  
  
}

