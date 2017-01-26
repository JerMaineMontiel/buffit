<img alt="buffit logo" style="max-width: 20px;" src="https://dl.dropboxusercontent.com/u/9299425/BUFFIT.png">

This app is built with [Node](http://nodejs.org) and [Express](http://expressjs.com), and comes ready to go for Heroku deployment. 

Other modules used are the [body-parser](https://github.com/expressjs/body-parser) middleware for express and [request](https://github.com/request/request) for simplified HTTP requests. You can also check out the [Slack API](http://api.slack.com) and the [Buffer API](http://buffer.com/developers/api) documentation for more information.

<h3>Get you an app for your Buffer</h3>
First thing you should is set up an app for your [Buffer account](http://buffer.com/developers), and take note of the credentials: 
<ul>
<li>client_id </li>
<li>client_secret (you'll receive this by email)</li>
<li>access_token </li>
</ul>

`redirect_uri` is required to set up the app, however, you won't be in need of that for the slash command.

<h3>Deploy the code to Heroku</h3>
Next step is deploying the code to Heroku. But **before you do**, check the `PROFILE_IDS` object in the code and add the profiles you would like to post to. 

```javascript
const PROFILE_IDS =
{
  'service': ['username']
};
```
A little explanation how it works:
<ul>
<li>the app makes a request to the Buffer API for the list of profiles you have.</li>
<li>the app will then search for <em>service</em>, then <em>username</em> in the packet that was received.  It'll get the corresponding <em>id</em> for use in the API request</li> 
<li>the <em>service</em> values are an array, so just add the usernames of any profile for that service. For example, if you have two Twitter profiles you'd like to post to, add <em>'twitter': [ 'handle1', 'handle2' ]</em> to the object.</li>
</ul>

Once you've done that and deployed the code, take note of the URL to your app in Settings. (should be an https URL). This is also where your Config Vars are located, so plug those Buffer credentials in there.

<h3>Set up a slash command integration for your Slack group</h3>
Check out [this page](https://api.slack.com/custom-integrations) on steps to do that. 

You'll use the Heroku URL at set up, with the "/command" route at the end. (ex: https:// yourapp.herokuapp.com /command) Also take note of the access token it gives you, and go back to your Config Vars in the Heroku settings and plug it in.

<h3>Test it out!</h3>
A simple `/buffit` (or actually, whatever slash command you gave at set up) and `hello world` to test and you're good to go! The app will post back to the channel where you initiated the command with a nice "thank you" message. And double check your Buffer queue for the post. :)

Any issues you find, feel free to let me know or make a pull request. Hope you like it!
