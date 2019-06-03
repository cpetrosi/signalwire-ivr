const { RestClient } = require('@signalwire/node')
var express = require("express");
var app = express();
app.use(express.urlencoded());

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

app.post("/transcription", (req, res, next) => {
  var response = new RestClient.LaML.MessagingResponse();

  function sendSms(to, from) {
    const project = 'YourProjectID';
    const token = 'YourAuthToken';
    const client = new RestClient(project, token, { signalwireSpaceUrl: 'example.signalwire.com' });

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


  const to = '+XXXXXXXXXXX';
  const from = '+XXXXXXXXXXX';
  sendSms(to, from);

  res.set('Content-Type', 'text/xml');
  res.send(response.toString());
  console.log("transcription Request Params from server  --->" + JSON.stringify(req.body));
});



app.get("/mmv-response", (req, res, next) => {
  var response = new RestClient.LaML.VoiceResponse();
  var dial = response.dial({ timeout: 10 });
  var digits = req.query.Digits;
  var speech = req.query.SpeechResult;

  if (digits == "1" || speech == "help") {
    dial.number('XXX-XXX-XXXX');
    response.say('Sorry, the person you are trying to reach is not available. Please leave a message after the beep. Press the pound key when you are finished.');
    response.record({
      maxLength: 20,
      action: 'https://sub.domain.com:3000/recording',
      method: 'GET',
      finishOnKey: '#',
      transcribe: true,
      transcribeCallback: 'https://sub.domain.com:3000/transcription'
    });
  }
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

app.get("/recording", (req, res, next) => {

  res.set('Content-Type', 'text/xml');

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
