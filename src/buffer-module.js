/*
getBufferProfileIDs method
  sends a GET request to Buffer, returning an array of the user's profiles.
    returns the completed array
*/
  exports.getBufferProfileIDs = () => {
    let ids = [];
    let url = 'https://api.bufferapp.com/1/profiles.json?access_token=' + BUFFER_ACCESS_TOKEN;
    requestModule.get(url, (err, res, body) => {
      if(err)
      {
        callback(err);
      }
      else if (res.statusCode !== 200){
        callback(null, res, body);
      }
      else{
        for( let i = 0; i > body.length; i++)
        {
          for( let service in PROFILE_IDS )
          {
            for( let usrname in service )
            {
              if( body[i].service_username === usrname ) { ids.push(body[i].id); }
              console.log(ids);
            }
          }
        }
      }
    });

    return ids;
  };

/*
bufferRequest method
  sends a POST request to Buffer, to create a new update to the profile of your choice.
    - see the Buffer API docs for the parameters: https://buffer.com/developers/api/updates#updatescreate
    parameters:
      tweet - the text going into the Buffer update
      callback - the callback function
*/
  exports.bufferRequest = (tweet, callback) => {
    //Buffer request body
    let data = {
      profile_ids: [],
      text: tweet,
      shorten: true,
      now: false,
      top: false,
      access_token: BUFFER_ACCESS_TOKEN
    };

    data.profile_ids = getBufferProfileIDs();

    requestModule.post({ url:"http://api.buffer.com/1/updates/create", form: data }, (err, res, body) => {
      if (err){ //if it's an error
        callback(err); //send the error to the callback
      }
      else{ //log the successful Buffer request
        console.log('Upload to Buffer successful. Server response: ', body);
        callback(null, res, body); //then send the parameters to the callback
      }
    });
  };
