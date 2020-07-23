const LINE_CHANNEL_ACCESSTOKEN: string = PropertiesService.getScriptProperties().getProperty('LINE_CHANNEL_ACCESSTOKEN');

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

    let replyMessageToLINE: string = userMessage;

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
        
    // return ContentService.createTextOutput(
    // JSON.stringify({'content': 'post ok'})
    // ).setMimeType(ContentService.MimeType.JSON);
}