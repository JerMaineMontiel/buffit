'use strict';
const express = require('express');
const bodyParser = require('body-parser'); //auto-parses the payload
const requestModule = require('request'); //for creating http requests

const app = express();
const PORT = process.env.PORT || 4400;
app.use(bodyParser.json()); //parse all payloads
app.use(bodyParser.urlencoded({ extended: true }));

//insert your Slack token here, or through Heroku
const SLACK_TOKEN = process.env.SLACK_TOKEN || 'xxxxxxxxxxx';

//insert your Buffer client ID, or through Heroku
const BUFFER_CLIENT_ID = process.env.BUFFER_CLIENT_ID || 'xxxxxxxxxxx';
//insert your Buffer client secret, or through Heroku
const BUFFER_CLIENT_SECRET = process.env.BUFFER_CLIENT_SECRET || 'xxxxxxxxxxx';
//inser your Buffer access token, or through Heroku
const BUFFER_ACCESS_TOKEN = process.env.BUFFER_ACCESS_TOKEN || "xxxxxxxxxxx";
//object of service:username array pairs, for use in the Buffer request
const PROFILE_IDS = process.env.BUFFER_PROFILE_IDS ||
{};

/*
getBufferProfileIDs method
  sends a GET request to Buffer, returning an array of the user's profiles.
    returns the completed array
*/
const getBufferProfileIDs = (callback) => {
  let ids = [];
  let url = 'https://api.bufferapp.com/1/profiles.json?access_token=' + BUFFER_ACCESS_TOKEN;
  requestModule.get(url, (err, res, body) => {
    if(err)
    {
      console.log('getBufferProfileIDs(): there was an error.');
      callback(err);
    }
    else if (res.statusCode !== 200){
      console.log('getBufferProfileIDs(): Something happened.');
      callback(null, res, body);
    }
    else{
      console.log('profiles received.');
      let resData = JSON.parse(body);

      for( let i = 0; i < resData.length; i++)
      {
        for( let service in PROFILE_IDS )
        {
          for( let j = 0; j < PROFILE_IDS[service].length; j++ )
          {
            if(resData[i].service === service )
            {
              if( resData[i].service_username === PROFILE_IDS[service][j] ) { ids.push(resData[i].id); }
              console.log(ids);
            }
          }
        }
      }
    }
    callback(ids);
  });
};

/*
bufferRequest method
  sends a POST request to Buffer, to create a new update to the profile of your choice.
    - see the Buffer API docs for the parameters: https://buffer.com/developers/api/updates#updatescreate
    parameters:
      tweet - the text going into the Buffer update
      callback - the callback function
*/
const bufferRequest = (tweet, callback) => {
  //Buffer request body
  let data = {
    text: tweet,
    shorten: true,
    now: false,
    top: false,
    access_token: BUFFER_ACCESS_TOKEN
  };

  getBufferProfileIDs( (ids) => {
    data.profile_ids = ids;
    console.log(data);
    requestModule.post({ url:"https://api.bufferapp.com/1/updates/create.json", form: data }, (err, res, body) => {
      if (err){ //if it's an error
        callback(err); //send the error to the callback
      }
      else if(res.statusCode != 200){
        console.log('bufferRequest(): Something happened.');
        callback(null, res, body);
      }
      else{ //log the successful Buffer request
        console.log('bufferRequest(): Upload to Buffer successful.');
        callback(null, res, body); //then send the parameters to the callback
      }
    });
  });
};

/*
slackResponse method
  once the slash command is received and succesfully posted to Buffer, a 'Thank you!' message will be sent back to the user.
    parameters:
      req - request object
      res - response object
      callback - the callback function
*/
const slackResponse = (req, res, callback) => {
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
    callback();
  }
};

/*
/command route
  this is the endpoint that's touched when a slash command is fired.
*/
app.post('/command', (request, response) => {
  if( request.body.token === SLACK_TOKEN )
  {
    bufferRequest(request.body.text, (err, res, body) => {
      if( err ){
        console.error('Upload failed: ', err);
      }
      else if( res.statusCode !== 200 ){
        console.log('Status Code: %s', res.StatusCode);
        console.log(body);
      }
      else{
        slackResponse(request, response, () => {
          console.log('app.post(): thank you message posted to Slack.');
        });
      }
    });
  }
  else{
    response.status(401).send("Sorry, not authorized.");
    response.end();
  }
});

app.get('/command', (request, response) => {
  if( response.body.ssl_check === 1 ){
    response.status(200);
    response.end;
  }
});

app.listen(PORT, () => {
  console.log('app.listen(): app is running on port %s', PORT);
});
