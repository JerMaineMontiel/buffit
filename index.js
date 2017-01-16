const SLACK_TOKEN = 'xxxxxxxxxxx'; //insert your Slack token
const BUFFER_TOKEN = 'xxxxxxxxxxx'; //insert your Buffer token
const channelID = 'xxxxx'; //channel id

var http = require('http');

const checkChannel = (channel) => { channel === channelID; }
const sendToBuffer = (text) => {
  if(text != ""){

    http.get('https://api.bufferapp.com/1/profiles.json?pretty=true')
  }
}
http.createServer( (request, response) => {
  var headers = request.headers,
  method = request.method,
  url = request.url;

  if( request.token === SLACK_TOKEN )
  {
    switch (request.type)
      case "url_verification":
        {
          response.writeHead(200, { 'Content-type': 'application/x-www-form-urlencoded'});
          response.end('challenge=' + response.challenge );
          break;
        }
      case "event_callback":
        {
          response.writeHead(200);
          response.end();
          var item = response.event.item;
          if( checkChannel(item.channel) )
            {
              sendToBuffer(item.text);
            }
          break;
        }
  }
  else{
    response.writeHead(401)
    response.end();
  }

  var body = [];
  request.on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body);
  });

  request.on('error', (error) => {
    console.error(error);
  });



}).listen(8000);
