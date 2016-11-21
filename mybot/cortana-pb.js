var restify = require('restify');
var builder = require('botbuilder');

var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
   console.log('%s listening to %s', server.name, server.url); 
});

// Create bot and bind to console
var connector = new builder.ChatConnector({
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
});
var bot = new builder.UniversalBot(connector);
server.post('/api/messages', connector.listen());

// Create LUIS recognizer that points at our model and add it as the root '/' dialog for our Cortana Bot.
var model = 'https://api.projectoxford.ai/luis/v2.0/apps/c413b2ef-382c-45bd-8ff0-f76d60e2a821?subscription-key=d4ed0fd595e345b6b0ad8d82df53b1b0&q=';
var recognizer = new builder.LuisRecognizer(model);
var dialog = new builder.IntentDialog({ recognizers: [recognizer] });
bot.dialog('/', dialog);

// Add intent handlers
dialog.matches(
    'builtin.intent.alarm.set_alarm', 
    builder.DialogAction.send('Creating Alarm'));
dialog.matches(
    'builtin.intent.alarm.delete_alarm', 
    builder.DialogAction.send('Deleting Alarm'));

dialog.onDefault(
    builder.DialogAction
    .send("I'm sorry I didn't understand. I can only create & delete alarms."));