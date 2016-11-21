var restify = require('restify');
var builder = require('botbuilder');

//=========================================================
// Bot Setup
//=========================================================

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});
  
// Create chat bot
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
var intents = new builder.IntentDialog();
server.post('/api/messages', connector.listen());

//=========================================================
// Bots Dialogs
//=========================================================

bot.dialog('/', intents);

intents.matches(/^change name/i, [
    function (session) {
        session.beginDialog('/profile');
    },
    function (session, results) {
        session.send('OK Change your name to %s',session.userData.name);
    }
]);

intents.onDefault([
    function (session, args, next) {
        if (!session.userData.name) {
            session.beginDialog('/proflie');
        } else {
            next();
        }
    },
    function (session,results) {
        session.send('Hello %s!',session.userData.name);
    }
]);

bot.dialog('/profile', [
    function (session) {
        builder.Prompts.text(session,'Hi what your name?');
    },
    function (session, results) {
        session.userData.name = results.response;
        session.endDialog();
    }
]);