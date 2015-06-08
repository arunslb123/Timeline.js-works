function setUp() {
    ScriptProperties.setProperty('active', SpreadsheetApp.getActiveSpreadsheet()
        .getId());
}

/**
 * doGet
 */
function doGet1(request) {
    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName("gopi_123");
    ss.setActiveSheet(sheet);
    updateLearnerType();

}

function updateLearnerType() {

    var ss = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet = ss.getSheetByName("gopi_123");
    ss.setActiveSheet(sheet);
    var data = sheet.getDataRange()
        .getValues();



    var ss_master = SpreadsheetApp.openById(ScriptProperties.getProperty('active'));
    var sheet_master = ss_master.getSheetByName("Master");
    ss_master.setActiveSheet(sheet_master);
    var data_master = sheet_master.getDataRange()
        .getValues();



    var range = sheet.getRange(2, 1);
    var studentType = range.getValue();
    var vocType = studentType[0];
    var quantType = studentType[2];
    Logger.log(vocType);
    Logger.log(quantType);

    var charIndexToNumber = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'AA', 'AB', 'AC', 'AD', 'AE', 'AF', 'AG', 'AH', 'AI', 'AJ', 'AK', 'AL', 'AM', 'AN', 'AO', 'AP', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AV', 'AW', 'AX', 'AY', 'AZ'];

    var task = ['G', 'L', 'Q', 'V'];

    for each(var t in task) {
        var ind = convertIndex(t, charIndexToNumber);
        var stringToUpdate;

        for (n = 1; n < data.length; n++) {
            var stringFormat = t + n;
            Logger.log(stringFormat);
            var range = sheet.getRange(stringFormat);
            var cell = data[n][ind];
            var checkType = data[n - 1][ind - 1];
            var oldFormula = range.getFormula();
            if (oldFormula != "") {
                var lastVal = oldFormula.match(/\d+$/)[0];

                if (checkType === "VOC" || checkType === "AWA") {
                    Logger.log("IN VOC");
                    if (vocType === 'F') {
                        stringToUpdate = "=Master!E";
                    } else if (vocType === 'A') {
                        stringToUpdate = "=Master!F";
                    } else if (vocType === 'S') {
                        stringToUpdate = "=Master!G";
                    }
                } else if (checkType === "QUA") {
                    Logger.log("In QUA");
                    if (quantType === 'F') {
                        stringToUpdate = "=Master!E";
                    } else if (quantType === 'A') {
                        stringToUpdate = "=Master!F";
                    } else if (quantType === 'S') {
                        stringToUpdate = "=Master!G";
                    }
                }
                var newFormula = stringToUpdate + lastVal;
                var currentCell = charIndexToNumber[ind + 1];
                currentCell = currentCell + n;
                // Logger.log(currentCell);
                currentCell = sheet.getRange(currentCell);
                currentCell.setFormula(newFormula);

            }
        }


    }
}


function convertIndex(t, charIndexToNumber) {
    for (var i = 0; i < charIndexToNumber.length; i++) {
        if (charIndexToNumber[i] === t) {
            return i;
        }
    }
}



function changeFormatString(numb, tex) {

    var alpha = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    var val = numb + 1;
    var output = alpha[tex] + val;
    return output;


}
