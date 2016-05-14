var gcm = require('../lib/node-gcm');

var message = new gcm.Message();

var sender_id = process.argv[2];
var content = process.argv[3];
var topic = "/topics/"+process.argv[4];
var avatar = process.argv[5];
var attachment_type = process.argv[6];
var attachment = process.argv[7];

console.log(topic);

message.addNotification('title', 'Infotel');
message.addNotification('body', 'Nouveau message');
message.addNotification('tag', topic);
message.addData('sender_id', sender_id);
message.addData('avatar', avatar);
message.addData('content', content);
message.addData('attachment_type', attachment_type);
if(attachment != null && attachment != "") message.addData('attachment_url', attachment);
//message.addData('date', '20160511');

//Replace your developer API key with GCM enabled here
//var sender = new gcm.Sender('AIza*******************5O6FM');
var sender = new gcm.Sender('AIzaSyD7r119JgnXQG2BUb_PQuBC86EA4f38tqE');

sender.sendNoRetry(message, { topic: topic }, function (err, response) {
                if(err) console.error(err);
                else    console.log(response);
        });
