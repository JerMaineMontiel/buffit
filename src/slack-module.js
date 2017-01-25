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
  }
};
