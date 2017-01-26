![buffit logo](https://dl.dropboxusercontent.com/u/9299425/BUFFIT.png)
###Use the /buffit slash command to send your Slack message to your Buffer account!

This app is built with [Node](http://nodejs.org) and [Express](http://expressjs.com), and comes ready to go for Heroku deployment.

####Get you an app for your Buffer
First thing you should is set up an app for your [Buffer account](http://buffer.com/developers), and take note of the credentials: 
 - `client_id`
 - `client_secret` (you'll receive this by email)
 - `access_token`
 
`redirect_uri` is required to set up the app; however, you won't be in need of that for the slash command. You won't actually be doing any authorization, as the `access_token` you're given is for your Buffer account.

####Deploy the code to Heroku
Next step is deploying the code to Heroku. But **before you do**, check the `PROFILE_IDS` object in the code and add the profiles you would like to post to. 

```javascript
const PROFILE_IDS =
{
  'service': ['username']
};
```
A little explanation how it works:
 - the app makes a request to the Buffer API for the list of profiles you have.
 - the app will then search for `service`, then `username` in the pack that was received.  It'll get the corresponding `id` for use in the API request. 
 - the `service` values are an array, so just add the usernames of any profile for that service. For example, if you have two Twitter profiles you'd like to post to, add `'twitter': [ 'handle1', 'handle2' ]` to the object.

For more info on this you can check out the [API docs](http://buffer.com/developers/api).

After you've deployed your code to Heroku, you can go to the Settings and input your Buffer credentials in the Config Vars.

Check out the [Slack API](http://api.slack.com) and the [Buffer API](http://buffer.com/developers/api) for more information.
