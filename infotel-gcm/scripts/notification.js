var gcm = require('../lib/node-gcm');

var message = new gcm.Message();

message.addNotification('title', 'Infotel');
message.addNotification('icon', 'goodway');
message.addNotification('body', 'Départ pour Paris iminent !');
message.addNotification('color', '#FF4081');
message.addData('type', 'notification');
message.addData('icon', 'http://data.goodway.io/img/alexis.jpg');

//Add your mobile device registration tokens here
//var regTokens = ['ecG3ps_bNBk:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxXl7TDJkW'];
var regTokens = ['dtqt9LCecHY:APA91bHVlJND_fMzu0S2jKQUzEa-XYynDxhEPRykK4CvnLKEaPeP-hVmqwLh5utpYH48MT40fS7FlkYEsbOk5UYfTOsmG3SKzcym35-HJSUOJX0wulHDmn2GQ7h0k3DsEL6GOOMsDwBf'];

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
