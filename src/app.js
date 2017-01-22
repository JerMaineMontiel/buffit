'use strict';
var express = require('express');
var http = require('http');
var app = express();

const SLACK_TOKEN = 'xxxxxxxxxxx'; //insert your Slack token
const BUFFER_TOKEN = 'xxxxxxxxxxx'; //insert your Buffer token
const channelID = 'xxxxx'; //channel id
const PORT = 4390;

app.listen(PORT, () => {
  console.log('app is running on port %s', PORT);
});
