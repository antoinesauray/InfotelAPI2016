var gcm = require('../lib/node-gcm');

var message = new gcm.Message();

var type = process.argv[3];
var sender_id = process.argv[4];
var content = process.argv[5];
var attachment_type = process.argv[6];
var attachment_url = process.argv[7];
var token = process.argv[8];

message.addData('type', type);
message.addData('sender_id', sender_id);
message.addData('content', content);
message.addData('attachment_type', attachment_type);
message.addData('attachment', attachment_url);
//message.addData('date', '20160511');

//Add your mobile device registration tokens here
//var regTokens = ['ecG3ps_bNBk:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXl7TDJkW'];
var regTokens = [token];

//Replace your developer API key with GCM enabled here
//var sender = new gcm.Sender('AIza*******************5O6FM');
var sender = new gcm.Sender('AIzaSyD7r119JgnXQG2BUb_PQuBC86EA4f38tqE');


sender.send(message, regTokens, function (err, response) {
    if(err) {
      console.error(err);
    } else {
      console.log(response);
    }
});
