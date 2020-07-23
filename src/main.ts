const LINE_CHANNEL_ACCESSTOKEN: string = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESSTOKEN');
const SPREADSHEET_ID: string = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
const SPREADSHEET_URL: string = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL');
const SHEET1_NAME: string = PropertiesService.getScriptProperties().getProperty('SHEET1_NAME');
const SHEET2_NAME: string = PropertiesService.getScriptProperties().getProperty('SHEET2_NAME');
const TOTALMINUTEROW: string = PropertiesService.getScriptProperties().getProperty('TOTALMINUTEROW');
const TOTALMINUTECOLUMN: string = PropertiesService.getScriptProperties().getProperty('TOTALMINUTECOLUMN');
const TOTALHOURROW: string = PropertiesService.getScriptProperties().getProperty('TOTALHOURROW');
const TOTALHOURCOLUMN: string = PropertiesService.getScriptProperties().getProperty('TOTALHOURCOLUMN');

function doPost(e: string) {
    let event = JSON.parse(e.postData.contents).events[0];
    let replyToken: string = event.replyToken;

    if (typeof replyToken === 'undefined') {
        throw new Error('undefined Token');
    }

    let userId: string = event.source.userId;

    if (event.type !== 'message') {
        return;
    }
    let userMessage: string = event.message.text.replace(/　/g, ' ').trim();

    let replyMessageToLINE: string = getTotalRecord();

    if (replyMessageToLINE === ''){
        replyMessageToLINE = 'invalid Text';
    }

    // send to LINE
    const LINE_HTTPREQUEST_REPLY: string = 'https://api.line.me/v2/bot/message/reply';
    UrlFetchApp.fetch(LINE_HTTPREQUEST_REPLY, {
        'headers': {
        'Content-Type': 'application/json; charset=UTF-8',
        'Authorization': 'Bearer ' + LINE_CHANNEL_ACCESSTOKEN,
        },
        'method': 'post',
        'payload': JSON.stringify({
        'replyToken': replyToken,
        'messages': [{
            'type': 'text',
            'text': replyMessageToLINE,
        }],
        }),
    });
}

function getTotalRecord(){
    let targetSpreadSheet = SpreadsheetApp.openById(SPREADSHEET_ID);
    let targetSheet = targetSpreadSheet.getSheetByName(SHEET1_NAME);
    let totalMinuteRange = targetSheet.getRange(parseInt(TOTALMINUTEROW), parseInt(TOTALMINUTECOLUMN))
    let totalHourRange = targetSheet.getRange(parseInt(TOTALHOURROW), parseInt(TOTALHOURCOLUMN))

    let totalRecord: string = totalMinuteRange.getValue() + '分' + totalHourRange.getValue();
    return totalRecord;
} 