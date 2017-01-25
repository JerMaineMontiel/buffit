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
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN || "xxxxxxx";
//object of profile username:profile_id pairs by service, for use in the Buffer request
const PROFILE_IDS = {
  'twitter': {
    'talkdatcode': ''
  }
};

/*
/authorize route
  redirects to the Buffer login page to authorize the app
*/
app.get('/authorize', (req, res) => {

  let url = 'https://buffer.com/oauth2/authorize?client_id=' + BUFFER_CLIENT_ID +
  '&redirect_uri=' + BUFFER_REDIRECT_URI + '&response_type=code';

  res.redirect(url);
  res.end();

});

/*
/redirect route
  the redirect endpoint once authorization is given
*/
app.get('/redirect', (request, response) => {
  //body of the POST request
  debugger;
  let data = {
    client_id: BUFFER_CLIENT_ID,
     client_secret: BUFFER_CLIENT_SECRET,
     redirect_uri: BUFFER_REDIRECT_URI,
     code: BUFFER_ACCESS_TOKEN,
     grant_type: 'authorization_code'
  };
  console.log(request.body);
  // if(request.body.code)
  // {
  //   // //make the POST request
  //   // requestModule.post({url: 'https://api.bufferapp.com/1/oauth2/token', form: data }, (err, res, body) => {
    //   if(err)//log the error if there is one
    //   {
    //     console.error(err);
    //   }
    //   else if(res.statusCode !== 200) //log the status if it's other than 200
    //   {
    //     console.log('Something went wrong. Status Code %s | %s', res.statusCode, body);
    //     response.send('Something went wrong. Status Code ' + res.StatusCode + ' | ' + body);
    //     response.end();
    //   }
    //   else { //log the success and let the user know it was successful
    //     console.log(" Status Code %s | Success! Access token posted.\n %s", res.statusCode, body);
    //     response.send("Access token received. Thanks!");
    //     response.end();
    //   }

});
/*
/command route
  this is the endpoint that's touched when a slash command is fired.
*/
app.get('/command', (request, response) => {
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
