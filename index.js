const { RestClient } = require('@signalwire/node')
var express = require("express");
var app = express();
app.use(express.urlencoded());

app.get("/main-menu", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  var gather = response.gather({
    action: 'http://190.102.98.249:3000/mmv-response',
    method: 'GET',
    input: 'dtmf speech',
    hints: 'help, conference'
  })
  gather.say("Hello and welcome to SignalWire.");
  gather.say("If you're a customer in need of some assistance, press 1, or say help.");
  gather.say("If you have been invited to a conference, press 2, or say conference.");
  gather.say("If you know your party’s extension, you may dial it at any time.");
  gather.pause({ length: 10 });
  gather.say("Are you still there? Please make a selection or press star to hear the options again.");
  response.say("We did not receive an option. Goodbye.");

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("main-menu Request Params from server  --->" + JSON.stringify(req.query));
});

app.post("/transcription", (req, res, next) => {
  var response = new RestClient.LaML.MessagingResponse();

  function sendSms(to, from) {
    const project = '5510b4a4-c0a4-49ab-afef-a8526eb2ca4b';
    const token = 'PT3219285b81d960424116f1b1b44cfa931a9f232017c7ebfe';
    const client = new RestClient(project, token, { signalwireSpaceUrl: 'carleen.signalwire.com' });

    return client.messages.create({
      body: "Missed call from: " + req.body.From + ". Here is the message: " + req.body.TranscriptionText,
      from: from,
      to: to,
    }).then()
      .catch(function(error) {
        if (error.code === 21614) {
          console.log("Uh oh, looks like this caller can't receive SMS messages.")
        }
      })
      .done()
  };


  const to = '+16045628647';
  const from = '+13103560879';
  sendSms(to, from);

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("transcription Request Params from server  --->" + JSON.stringify(req.body));
});


app.get("/mmv-response", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  var digits = req.query.Digits;
  var speech = req.query.SpeechResult;

  if (digits == "1" || speech == "help") {
    var dial = response.dial({ timeout: 10 });
    dial.number('650-382-0000');
    response.say('Sorry, the person you are trying to reach is not available. Please leave a message after the beep. Press the pound key and hang up when you are finished.');
    response.record({
      maxLength: 20,
      action: 'http://190.102.98.249:3000/recording',
      method: 'GET',
      finishOnKey: '#',
      transcribe: true,
      transcribeCallback: 'http://190.102.98.249:3000/transcription'
    });
  }
  else if (digits == "2" || speech == "conference") { dial.conference('support'); }
  else if (digits == "*") {
    var gather = response.gather({
      action: 'http://190.102.98.249:3000/mmv-response',
      method: 'GET',
      input: 'dtmf speech',
      hints: 'help, conference'
    })
    gather.say("Hello and welcome to SignalWire.");
    gather.say("If you're a customer in need of some assistance, press 1, or say help.");
    gather.say("If you have been invited to a conference, press 2, or say conference.");
    gather.say("If you know your party’s extension, you may dial it at any time.");
    response.say("We did not receive an option. Goodbye.");
  }
  else if (digits == "2000") {
    response.say('Please hold, connecting you to Brian West.');
    var dial = response.dial();
    dial.number('650-434-8016');
  }
  else if (digits == "2001") {
    response.say('Please hold, connecting you to Jason Atkins.');
    var dial = response.dial();
    dial.number('650-434-8017');
  }
  else if (digits == "2002") {
    response.say('Please hold, connecting you to Ryan McGivern.');
    var dial = response.dial();
    dial.number('650-434-8018');
  }
  else if (digits == "2003") {
    response.say('Please hold, connecting you to Brent McNamara.');
    var dial = response.dial();
    dial.number('650-434-8019');
  }
  else if (digits == "2004") {
    response.say('Please hold, connecting you to Patrick Semple.');
    var dial = response.dial();
    dial.number('650-434-8020');
  }
  else if (digits == "2005") {
    response.say('Please hold, connecting you to Daniel Gotlieb.');
    var dial = response.dial();
    dial.number('650-434-8021');
  }
  else if (digits == "2006") {
    response.say('Please hold, connecting you to Sean Heiney.');
    var dial = response.dial();
    dial.number('650-434-8022');
  }
  else if (digits == "2007") {
    response.say('Please hold, connecting you to Michael Jerris.');
    var dial = response.dial();
    dial.number('650-434-8023');
  }
  else if (digits == "2008") {
    response.say('Please hold, connecting you to Shashi Kumar.');
    var dial = response.dial();
    dial.number('650-434-8024');
  }
  else if (digits == "2009") {
    response.say('Please hold, connecting you to Erik Lagerway.');
    var dial = response.dial();
    dial.number('650-434-8025');
  }
  else if (digits == "2010") {
    response.say('Please hold, connecting you to Evan McGee.');
    var dial = response.dial();
    dial.number('650-434-8026');
  }
  else if (digits == "2011") {
    response.say('Please hold, connecting you to Anthony Minessale.');
    var dial = response.dial();
    dial.number('650-434-8027');
  }
  else if (digits == "2012") {
    response.say('Please hold, connecting you to Jill Minessale.');
    var dial = response.dial();
    dial.number('650-434-8028');
  }
  else if (digits == "2013") {
    response.say('Please hold, connecting you to Fred Muteesa.');
    var dial = response.dial();
    dial.number('650-434-8029');
  }
  else if (digits == "2014") {
    response.say('Please hold, connecting you to Christopher Rienzo.');
    var dial = response.dial();
    dial.number('650-434-8030');
  }
  else if (digits == "2015") {
    response.say('Please hold, connecting you to Bryan Rite.');
    var dial = response.dial();
    dial.number('650-434-8031');
  }
  else if (digits == "2016") {
    response.say('Please hold, connecting you to Alex Sibyakin.');
    var dial = response.dial();
    dial.number('650-434-8032');
  }
  else if (digits == "2017") {
    response.say('Please hold, connecting you to Andrey Volk.');
    var dial = response.dial();
    dial.number('650-434-8033');
  }
  else if (digits == "2018") {
    response.say('Please hold, connecting you to Sharon White.');
    var dial = response.dial();
    dial.number('650-434-8034');
  }
  else if (digits == "2019") {
    response.say('Please hold, connecting you to Joshua Young.');
    var dial = response.dial();
    dial.number('650-434-8035');
  }
  else if (digits == "2020") {
    response.say('Please hold, connecting you to Shane Bryldt.');
    var dial = response.dial();
    dial.number('650-434-8036');
  }
  else if (digits == "2021") {
    response.say('Please hold, connecting you to Madison Ream.');
    var dial = response.dial();
    dial.number('650-434-8037');
  }
  else if (digits == "2022") {
    response.say('Please hold, connecting you to Abbi Minessale.');
    var dial = response.dial();
    dial.number('650-434-8038');
  }
  else { response.say('We received an incorrect option. Goodbye.'); }

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("mmv-response Request Params from server  --->" + JSON.stringify(req.query));
});

app.get("/recording", (req, res, next) => {

  res.set('Content-Type', 'text/xml');

});

app.get("/message", (req, res, next) => {
  var response = new RestClient.LaML.MessagingResponse();
  var body = req.query.Body;

  switch (body) {
    case "blog":
      response.message("Check out our blogs here: https://signalwire.com/blogs!");
      break
    case "docs":
      response.message("Here is our developer documentation: https://docs.signalwire.com.");
      break
    case "story":
      response.message("What SignalWire is all about: https://signalwire.com/about.");
      break
    default:
      response.message("Hello, and welcome to SignalWire!");
      response.message("For SignalWire blog posts, reply with blog.")
      response.message("For SignalWire developer documentation, reply with docs.")
      response.message("For our company story, reply with story.")
      break
  }

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("message Request Params from server  --->" + JSON.stringify(req.query));

});

app.listen(3000, '0.0.0.0', () => { console.log("Server running on port 3000"); });
