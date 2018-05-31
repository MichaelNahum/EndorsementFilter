const express = require('express');
const app  = express();
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/gmail.readonly'];
const TOKEN_PATH = 'credentials.json';

allMessages = [];
// Load client secrets from a local file.
fs.readFile('client_secret.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMessages); // call listMessages here!!!!
});

/**
* Create an OAuth2 client with the given credentials, and then execute the
* given callback function.
* @param {Object} credentials The authorization client credentials.
* @param {function} callback The callback to call with the authorized client.
*/
function authorize(credentials, callback) {
  const {client_secret, client_id, redirect_uris} = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
    fs.readFile(TOKEN_PATH, (err, token) => {
      if (err) return getNewToken(oAuth2Client, callback);
      oAuth2Client.setCredentials(JSON.parse(token));
      callback(oAuth2Client);
    });
  }

  /**
  * Get and store new token after prompting for user authorization, and then
  * execute the given callback with the authorized OAuth2 client.
  * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
  * @param {getEventsCallback} callback The callback for the authorized client.
  */
  function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
      rl.close();
      oAuth2Client.getToken(code, (err, token) => {
        if (err) return callback(err);
        oAuth2Client.setCredentials(token);
        // Store the token to disk for later program executions
        fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
          if (err) return console.error(err);
          console.log('Token stored to', TOKEN_PATH);
        });
        callback(oAuth2Client);
      });
    });
  }

  /**
  * Lists the labels in the user's account.
  *
  * @param {google.auth.OAuth2} An authorized OAuth2 client.
  */
  function listLabels(auth) {
    const gmail = google.gmail({version: 'v1', auth});
    gmail.users.labels.list({
      userId: 'me',
    }, (err, {data}) => {
      if (err) return console.log('The API returned an error: ' + err);
      const labels = data.labels;
      if (labels.length) {
        console.log('Labels:');
        labels.forEach((label) => {
          console.log(`- ${label.name}`);
        });
      } else {
        console.log('No labels found.');
      }
    });
  }

  function getMessage(gmail, messageId, callback) {
      let request = gmail.users.messages.get({
        'userId': 'me',
        'id': messageId
      }, callback); //what is callback doing?
    }

    function listMessages(auth) {
      const gmail = google.gmail({version: 'v1', auth});
      allMessages = [];

      gmail.users.messages.list({
        userId: 'me',
      }, (err, response) => {
        if (err) return console.log('The API returned an error: ' + err);
        let messages = response.data.messages;
        messages.forEach(email => {
          getMessage(gmail, email.id, (err, response) =>{
            if (response.data.labelIds[1] == "Label_7"){
              allMessages.push(response.data)
            }
          })
        })
      })
    };


    //
    //  ToDoList:
    //
    //  1. jquery logic for instantiating new endorsements with names, dates
    //  2. set userSearch.val with line 40's header.match(/WORD/g)
    //  3. wddwqweefefe

  app.set("view engine", "hbs")

  app.use(express.static('public'))


  app.get("/", (req, res) => {
    res.render("index", {messages: JSON.stringify(allMessages), test: '123'});
  });

  app.listen(3000, () => {
    console.log("app listening on port 3000")
  })
