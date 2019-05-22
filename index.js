const { RestClient } = require('@signalwire/node')
var express = require("express");
var app = express();

app.get("/main-menu", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  var gather = response.gather({
    action: 'https://sub.domain.com:3000/mmv-response',
    method: 'GET',
    input: 'dtmf speech',
    hints: 'help, conference, expert'
  })
  gather.say("Hello and welcome to SignalWire.", { voice: 'man' });
  gather.say("If you're a customer in need of help, press 1, or say help.", { voice: 'man' });
  gather.say("If you have been invited to a conference, press 2, or say conference.", { voice: 'man' });
  gather.say("If you're an expert assisting customers, press 3, or say expert.", { voice: 'man' });
  response.say("We did not receive an option. Goodbye.");

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("main-menu Request Params from server  --->" + JSON.stringify(req.query));
});

app.get("/mmv-response", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  var dial = response.dial();
  var digits = req.query.Digits;
  var speech = req.query.SpeechResult;

  if (digits == "1" || speech == "help") { dial.number('650-382-0000'); }
  else if (digits == "2" || speech == "conference") { dial.conference('support'); }
  else if (digits == "3" || speech == "expert") {
    dial.queue('expert');
    response.redirect('https://sub.domain.com:3000/requeue-agent', { method: 'GET' });
  }
  else { response.say('We received an incorrect option. Goodbye.'); }

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("mmv-response Request Params from server  --->" + JSON.stringify(req.query));
});

app.get("/requeue-agent", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  var dial = response.dial();

  dial.queue('expert');

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("requeue-agent Request Params from server  --->" + JSON.stringify(req.query));

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

app.listen(3000, () => { console.log("Server running on port 3000"); });
