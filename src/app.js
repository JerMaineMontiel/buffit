'use strict';
const express = require('express');
const bodyParser = require('body-parser'); //auto-parses the payload
const requestModule = require('request'); //for creating http requests

const app = express();
const PORT = process.env.PORT || 4390;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); //parse all payloads


const SLACK_TOKEN = process.env.SLACK_TOKEN || 'xxxxxxxxxxx'; //insert your Slack token here, or through Heroku

//insert your Buffer client ID, or through Heroku
const BUFFER_CLIENT_ID = process.env.BUFFER_CLIENT_ID || '58842b27942c4e69320f29a2';
//insert your Buffer redirect uri, or through Heroku
const BUFFER_REDIRECT_URI = process.env.BUFFER_REDIRECT_URI || 'http://6f0fed8d.ngrok.io/redirect';

const bufferRequest = (tweet, callback) => { //post the message to Buffer
  let data = {
    profile_ids: [],
    text: tweet,
    shorten: true,
    now: false,
    top: false,
  };
  requestModule.post("http://api.buffer.com/1/updates/create", form: data, (err, res, body) => { //create a Buffer request
    if (err){ //if it's an error
      callback(err); //send the error to the callback
    }
    else{ //log the successful Buffer request
      console.log('Upload to Buffer successful. Server response: ', body);
      callback(null, res, body); //then send the parameters to the callback
    }
  });
};

const slackResponse = (req, res, callback) => { //the message posted to the Slack once the Buffer has been updated
  var userName = req.body.user_name;
  var payload = {
    text: 'Thanks, ' + userName + '! Your message was added to Buffer.'
  };

  if ( userName !== 'slackbot')
  { //send the response back to the Slack channel
    return res.status(200).json(payload);
    callback();
  }
  else {
    return res.status(200).end();
  }
};

app.get('/command', (request, response) => {
  bufferRequest(request.body.text, (err, res, body) => {
    if( err ){
      console.error('Upload failed: ', err);
    }
    else if( res.statusCode !== 200 ){
      console.log('Something happened. Status Code: %s | %s', res.StatusCode, body);
    }
    else{
      console.log("Upload successful. Server response: ", body);
      slackResponse(request, response, () => {
        console.log('thank you message posted to Slack.');
      });
    }
  });
});
app.listen(PORT, () => {
  console.log('app is running on port %s', PORT);
});
