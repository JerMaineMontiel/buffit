'use strict';
const express = require('express');
const bodyParser = require('body-parser'); //auto-parses the payload
const requestModule = require('request'); //for creating http requests

const bufferModule = require('./buffer-module.js');
const slackModule = require('./slack-module.js');

const app = express();
const PORT = process.env.PORT || 4400;
app.use(bodyParser.json()); //parse all payloads
app.use(bodyParser.urlencoded({ extended: true }));

//insert your Slack token here, or through Heroku
const SLACK_TOKEN = process.env.SLACK_TOKEN || 'xxxxxxxxxxx';

//insert your Buffer client ID, or through Heroku
const BUFFER_CLIENT_ID = process.env.BUFFER_CLIENT_ID || '58842b27942c4e69320f29a2';
//insert your Buffer client secret, or through Heroku
const BUFFER_CLIENT_SECRET = process.env.BUFFER_CLIENT_SECRET || 'e715b31d629eecb339efe09c902e7479';
//insert your Buffer redirect uri, or through Heroku
const BUFFER_REDIRECT_URI = process.env.BUFFER_REDIRECT_URI || 'http://6f0fed8d.ngrok.io/redirect';
/* in the /redirect route, the app will receive access code after authorization, but you'll need to switch it out with this access_token. Check the Buffer API docs for more details: https://buffer.com/developers/api/oauth */
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN || "1/0a514d534c5aa60ef3fa479e3c74a3c8";
//object of profile username:profile_id pairs by service, for use in the Buffer request
const PROFILE_IDS = process.env.BUFFER_PROFILE_IDS ||
{
  'twitter': {
    'talkdatcode': ''
  }
};

/*
/command route
  this is the endpoint that's touched when a slash command is fired.
*/
app.post('/command', (request, response) => {
  if( request.code === SLACK_TOKEN )
  {
    bufferModule.bufferRequest(request.body.text, (err, res, body) => {
      if( err ){
        console.error('Upload failed: ', err);
      }
      else if( res.statusCode !== 200 ){
        console.log('Something happened. Status Code: %s | %s', res.StatusCode, body);
      }
      else{
        console.log("Upload successful. Server response: ", body);
        slackModule.slackResponse(request, response, () => {
          console.log('thank you message posted to Slack.');
        });
      }
    });
  }
  else{
    response.status(401).send("Sorry, not authorized.");
    response.end();
  }
});

app.listen(PORT, () => {
  console.log('app is running on port %s', PORT);
});
