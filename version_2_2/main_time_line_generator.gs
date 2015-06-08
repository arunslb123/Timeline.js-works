/**
 *This is the main script, aiming for generating timeline based on the input username, timestamp and planvalue. If there is a sheet for the username,
 then we should display their respective sheets, otherwise we should display three different sheets with 1 month , 3 months and 6 months plan
 */
function setUp() {
    ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet()
        .getId());
}

function doPost(e) {

    Logger.log(e.parameter.dat);
    updateHomeWorkDone(e.parameter.dat);
    // var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    //    var sheet = ss.getSheetByName("gopi_123");
    //    ss.setActiveSheet(sheet);
    //    var data = sheet.getDataRange().getValues();
    //var f=e.dat;
    //
    //var task=[6,11,16,21];
    //
    ////Logger.log(data[5][21])
    //    for (var i = 2; i < data.length; i++) {
    //        for each(var j in task) {
    //         var d= data[i][j];
    //         Logger.log(d)
    //         if(d!=''){
    //         var pos=d.indexOf(f);
    //         if(pos>=0){
    //         updateHomeWorkDone();
    //         }
    //         }
    //         }
    //         }



}

function updateHomeWorkDone(dat1) {
    var f = dat1;
    var task = [6, 11, 16, 21];
    var charIndexToNumber = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];
    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName("gopi_123");
    ss.setActiveSheet(sheet);
    var data = sheet.getDataRange()
        .getValues();
    //Logger.log(data[5][21])
    for (var i = 2; i < data.length; i++) {
        for each(var j in task) {
            var d = data[i][j];
            Logger.log(d)
            if (d != '') {
                var pos = d.indexOf(f);
                if (pos >= 0) {
                    var strToChange = charIndexToNumber[(j + 2)] + (i + 1);

                    var range2 = sheet.getRange(strToChange);
                    var prevValue = range2.getValue();
                    if (prevValue === 'yes') {
                        range2.clearContent();
                        range2.setValue('no');
                    } else if (prevValue === 'no') {
                        range2.clearContent();
                        range2.setValue('yes');

                    }

                }
            }
        }
    }


}

function doGet(request) {
    // 'https://script.google.com/macros/s/AKfycbw4KSPttBTK3NQda17jLj2d_Yz6L2Z135KRmP81pKaZS04NDtJ_/exec?id=123&timestamp=1435708800&plan=3',


    var username = null;
    var timestamp = null;
    var planvalue = null;
    if (request.parameter.id != null) {
        var username = request.parameter.id;
        username = parseInt(username, 10);
    }
    if (request.parameter.timestamp != null) {
        var timestamp = request.parameter.timestamp;
        timestamp = parseInt(timestamp, 10);
    }

    if (request.parameter.plan != null) {
        var planvalue = request.parameter.plan;
        planvalue = parseInt(planvalue, 10);
    }



    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName("JSON_SHEET");
    ss.setActiveSheet(sheet);
    var data = sheet.getDataRange()
        .getValues();
    var sheets = [];
    for (var i = 0; i < data.length; i++) {
        sheets.push(data[i][0]);

    }




    for each(var sh in sheets) {

        var sheetName = sh;
        if (sheetName.indexOf('_') > 0) {
            var index = sheetName.indexOf('_');
            var newName = sheetName.slice(index + 1, sheetName.length);
            if (newName == username) {
                username = sheetName;
            }
        }
    }

    if (username != null) {
        for (var j = 0; j < data.length; j++) {
            if (data[j][0] === username) {
                var jsonvalue = data[j][1];
            }
        }
        // if username is there, but we could'nt find their respective sheet in our sheet DB
        if (typeof jsonvalue === 'undefined') {
            username = null;
        }


    }
    if (username === null && timestamp != null) {
        if (planvalue === 1) {
            for (var j = 0; j < data.length; j++) {
                if (data[j][0] === "1month") {
                    var jsonvalue = data[j][1];
                    jsonvalue = changeDate(jsonvalue, timestamp);
                }
                // jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
            }

        } else if (planvalue === 3) {
            for (var j = 0; j < data.length; j++) {
                if (data[j][0] === "3month") {
                    var jsonvalue = data[j][1];
                    jsonvalue = changeDate(jsonvalue, timestamp);
                }

                //jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
            }

        } else if (planvalue === 6) {
            for (var j = 0; j < data.length; j++) {
                if (data[j][0] === "6month") {
                    var jsonvalue = data[j][1];
                    jsonvalue = changeDate(jsonvalue, timestamp);

                }
                // Logger.log(jsonvalue);
                //  jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);
            }

        }

    } else if (username === null && timestamp === null && planvalue === null) {
        for (var j = 0; j < data.length; j++) {
            if (data[j][0] === "default") {
                var jsonvalue = data[j][1];
            }
            // Logger.log(jsonvalue);
            // jsonvalue=ContentService.createTextOutput(jsonvalue).setMimeType(ContentService.MimeType.JSON);

        }

        //  return jsonvalue;
        // write code to return default sheet with default date
    }



    //return jsonvalue;


    var outputJson = ContentService.createTextOutput(jsonvalue)
        .setMimeType(ContentService.MimeType.JSON);
    //var outputJson=  includePhysicalClassToJson(jsonvalue);

    // return  ContentService.createTextOutput(outputJson).setMimeType(ContentService.MimeType.JSON);
    return outputJson;


}

function changeDate(jsonvalue, timestamp) {
    var d = new Date(timestamp * 1000); // just some date for calculation
    var formattedDate2 = Utilities.formatDate(d, "IST", "yyyy/MM/dd");

    var formattedDate1 = new Date(formattedDate2);




    jsonvalue = JSON.parse(jsonvalue);

    var startDatePrev = 0;
    for (var i = 0; i < jsonvalue.timeline.date.length; i++) {
        //var tempStartPrev=jsonvalue.timeline.date[i-1].startDate;

        //var tempStartPrev=jsonvalue.timeline.date[i-1].startDate;

        var tempStart = jsonvalue.timeline.date[i].startDate;
        var tempEnd = jsonvalue.timeline.date[i].endDate;
        var indexPos = tempStart.indexOf('_');
        var dateToAdd = tempStart.slice(0, indexPos);


        var hoursToAdd = tempStart.slice(indexPos + 1, tempStart.length);
        dateToAdd = parseInt(dateToAdd, 10);
        startDatePrev = parseInt(startDatePrev, 10);
        if (startDatePrev != dateToAdd) {
            startDatePrev = dateToAdd;
            var result = parseInt(dateToAdd, 10);
            var date_result = parseInt(formattedDate1.getDate(), 10);
            dateToAdd = result + date_result;

            formattedDate1.setDate(dateToAdd);

        }

        formattedDate1.setHours(hoursToAdd);
        //}else{
        //formattedDate1.setDate(formattedDate1.getDate());
        //}

        var newDate = formattedDate1.getFullYear() + ',' + (formattedDate1.getMonth() + 1) + ',' + formattedDate1.getDate() + ',' + formattedDate1.getHours() + ',' + formattedDate1.getMinutes() + ',' + formattedDate1.getSeconds();

        jsonvalue.timeline.date[i].startDate = newDate;
        jsonvalue.timeline.date[i].endDate = newDate;
        jsonvalue.timeline.usernamecheck = 'false';

    }

    return JSON.stringify(jsonvalue);



}

function includePhysicalClassToJson(tempJson) {
    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName("JSON_SHEET");
    ss.setActiveSheet(sheet);
    var data = sheet.getDataRange()
        .getValues();
    var tempJson1 = JSON.parse(tempJson);
    var firstDate = tempJson1.timeline.date[0].startDate;
    var lastDate = tempJson1.timeline.date[tempJson1.timeline.date.length - 1].startDate;

    //    for (var j = 0; j < data.length; j++) {
    //                if (data[j][0] === "Classroom") {
    //                    var datejsonvalue = data[j][1];
    //                    }
    //                  }
    // To reduce the execution time, i commented the above line
    var datejsonvalue = data[0][1]; // directly getting the sheet data for faster access.

    datejsonvalue = JSON.parse(datejsonvalue);



    for (var i = 0; i < datejsonvalue.date.length; i++) {
        var stDate = datejsonvalue.date[i].startDate;
        if (isBetween(stDate, firstDate, lastDate)) {
            tempJson1.timeline.date.push(datejsonvalue.date[i]);
        }
    }




    tempJson1 = JSON.stringify(tempJson1);
    // Logger.log(tempJson1)
    return tempJson1;

}

function isBetween(stDate, firstDate, lastDate) {

    var tempCheck = stDate.split(",");
    var tempFirst = firstDate.split(",");
    var tempLast = lastDate.split(",");
    var dateFrom = new Date(tempFirst[0], tempFirst[1] - 1, tempFirst[2]);
    var dateTo = new Date(tempLast[0], tempLast[1] - 1, tempLast[2]);
    var dateCheck = new Date(tempCheck[0], tempCheck[1] - 1, tempCheck[2]);



    dateFrom = Utilities.formatDate(dateFrom, "IST", "yyyy/MM/dd");
    dateTo = Utilities.formatDate(dateTo, "IST", "yyyy/MM/dd");
    dateCheck = Utilities.formatDate(dateCheck, "IST", "yyyy/MM/dd");



    var d1 = dateFrom.split("/");
    var d2 = dateTo.split("/");
    var c = dateCheck.split("/");

    var from = new Date(d1[0], d1[1] - 1, d1[2]); // -1 because months are from 0 to 11
    var to = new Date(d2[0], d2[1] - 1, d2[2]);
    var check = new Date(c[0], c[1] - 1, c[2]);

    if (check > from && check < to) {
        return true;
    } else {
        return false;
    }

}
