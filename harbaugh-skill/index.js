// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("hello 10 event.session.application.applicationId=" + event.session.application.applicationId);
        console.log("event.request.type::" + event.request.type);
        console.log("event.request::"+event.request);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        
        if (event.session.application.applicationId !== "amzn1.ask.skill.b283cd90-bac0-462e-8a03-7e4ab8ac7b72") {
             context.fail("Invalid Application ID");
        }
        

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId +
        ", sessionId=" + session.sessionId + "intentRequest.intent.name::" + intentRequest.intent.name
        );

   
    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;
    
     console.log("intentName::"+intentName);

    // Dispatch to your skill's intent handlers
    if ((intentRequest.intent.name === undefined) ||
    (intentName === null) || (intentName == "undefined"))  {
       console.log("undefined loop::"+intentName);    
       getWelcomeResponseV2(callback);
    }
    else if (intentRequest.intent.name === "hailToVictors") {
        console.log("hailToVictors::"+intentName);
        hailToVictors(intent, session, callback);
        return;
    }
    else if (intentRequest.intent.name === "quotes") {
        console.log("hailToVictors::"+intentName);
        getRandomQuotes(intent, session, callback);
        return;
    }
    else if (intentRequest.intent.name === "whoGotItBetter") {
        console.log("whoGotItBetter::"+intentName);
        whoGotItBetter(intent, session, callback);
        return;
    }
    else if ("AMAZON.StopIntent" == intentName) {
         console.log("stop::"+intentName);
         stop(intent, session, callback);
          return;
    } 
    else if ("AMAZON.CancelIntent" == intentName) {
        console.log("cancel::"+intentName);
        stop(intent, session, callback);
          return;
    } 
    else if ("AMAZON.HelpIntent" == intentName) {
        console.log("help::"+intentName);
        getHelpResponse(callback);
    } else {
       console.log("else loop::"+intentName);    
       getWelcomeResponseV2(callback);
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Harbaugh says Go Blue";
    var speechOutput = "Welcome to the Harbaugh skill. It's like having your own personal Jim Harbaugh, and who wouldn't want that? Go Blue. To help you attack this day with an enthusiasm unknown to mankind, you can say things like ask Harbaugh for a quote. Or ask Harbaugh to play The Victors. Or I dare you to ask Harbaugh who's got it better than us. So, what will it be?" ; 
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Harbaugh is hungry. Ask him for a quote, ask him for the fight song, or ask him who's got it better than us." ;
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Help Harbaugh Help You";
    var speechOutput = "Harbaugh is always happy to help. You can say things like play the Victors, give me a quote, or you can scream, who's got it better than us!?" ;
    var repromptText = "Harbaugh is hungry. Ask him for a quote, ask him for the fight song, or ask him who's got it better than us";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function hailToVictors(intent, session, callback) {
    var cardTitle = "Playing The Victors";
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    var cardOutput = "Hail to the Victors!!!";
    
    speechOutput = "<audio src=\"https:\/\/s3.amazonaws.com\/michigansongs\/University+of+Michigan+-+Fight+Song.mp3\" \/>";
    //repromptText = "You can ask me another Card like DiscoverMore?";
    
    callback(sessionAttributes,
         buildSpeechletResponseV2(cardTitle, speechOutput,cardOutput, repromptText, shouldEndSession));
}

function whoGotItBetter(intent, session, callback) {
    var cardTitle = "WHO'S GOT IT BETTER THAN US!?";
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = "NOBODY!!!";
    //repromptText = "You can ask me another Card like DiscoverMore?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}
/**
 * Returns a random number between min (inclusive) and max (exclusive)
 */
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

function getRandomInt(min, max) {
    console.log("max" + max);
    console.log("min" + min);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomQuotes(intent, session, callback) {
    var cardTitle = "A Quote From Coach";
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    var quotes = [];
    quotes.push("That is football. It started back when they had leather helmets before they started putting numerals on the side and names on the backs of jerseys - that playing time would be earned. And starting positions would be earned, and your contribution to the team being earned. It's been that way since the inception of football.");
    quotes.push("I don't take vacations. I don't get sick. I don't observe major holidays. I'm a jack hammer.");
    quotes.push("Hustle. Hustling at all times. Better today than yesterday, better tomorrow than today.");
    quotes.push("There are no turnarounds at Michigan. This is greatness. Long tradition of it.");
    quotes.push("Top to bottom Michigan is about excellence, greatness. You have my pledge I will carry forward the excellence of Michigan football.");
    quotes.push("We're going to play in the Rose Bowl this year, I guarantee it.");
    quotes.push("Drink more milk. As much as your belly will hold, kids. And make sure it’s whole milk. Not the candy ass two percent. But if you’re out of milk, it’s OK to substitute Gatorade on your cereal. If you can stomach it.");
    quotes.push("I take a vitamin every day. It's called steak.");
    quotes.push("If worms had machine guns, then birds would be scared of them.");
    quotes.push("I've been trying to advise my kids to get two Halloween costumes this year, to be go getters. Better to jog or run from house to house then you can get more candy than anyone else. Then come home and make a quick change into a second costume and hit those same houses again.");
    quotes.push("Zoo lions get tired of zebra after a while and want filet mignon. Not jungle lions.");
    quotes.push("I was and still am happier than a pig in slop.");
    quotes.push("I own other pants. It’s gotten to the point where I save so much time a day knowing that I don't have to stand in front of the closet, trying to decide what outfit to pick out. About 15 to 20 minutes a day. That adds up day after day.");
    quotes.push("I’m not a food critic, merely a blunt instrument who only knows football.");
    quotes.push("Steak is my favorite item on the traditional Thanksgiving menu.");
    quotes.push("I truly believe the number one natural steroid is sleep and the number two natural steroid is milk, whole milk, and three would be water. Four would be steak.");
    quotes.push("I feel like this is the only personality I have.");
    quotes.push("There’s a battle rhythm, a body clock that tells you it’s time for football. For me, it’s always I know when I get my first football dream. That’s my body clock telling me it’s time to compete. It’s like a bell at a boxing match, ding, ding. The bugler’s call at the Kentucky Derby.");
    quotes.push("That's kind of the way the pickle squirted this year.");
    quotes.push("During my life I've dreamed of coaching at the University of Michigan. Now I have the honor to live it.");
    quotes.push("I shook his hand too hard. I mean I really went in and it was strong and kind of slap-grab-handshake... So, that was on me. Personally I can get better at the postgame handshake and we'll attempt to do that. I don't think there's any reason for an apology. We spoke about it after the game, and at some point we'll talk in private. Apologies always seem to me like excuses.");
    quotes.push("I love football. I think football is the last bastion of hope for toughness in America in men.");
    quotes.push("Fans have a constitutional right to expect success and have high expectations.");
    quotes.push("I was reminded of another very special word when I was driving into Ann Arbor this morning, and that word is homecoming. Our family's had three homecomings to Ann Arbor, Michigan, in my lifetime.");
    quotes.push("Yeah, it's like coming out of a mother's womb. You're in a nice, warm, cozy environment - safe. And now you are out into the chaos and bright lights. It's a happening. It's all those things rolled into one.");
    quotes.push("It's like Thanksgiving. It's like New Years Day. It's like a family reunion. And having it all rolled into one. Most people think January first as the start of the new year. To people who espouse to Catholicism and Christianity, the start of spring practice and the first day of summer training camp are what you look at as the New Year with fireworks going off, it's your birthday. It's being born back into football, it's a happening.");
    quotes.push("The football gods have provided us heat and sun to shape the body and carve the mind.");
    quotes.push("I know we'll be best friends within a year's time.");
    quotes.push("My default is yes, when asked to do things.");
    quotes.push("Do not be deceived. You will reap what you sow.");
    quotes.push("Tough, smart, hard-nosed. Welcome to Michigan.");
    quotes.push("Being on the ball team takes the weight of the world off your shoulders, it's the 5th dimension. Nothing better!");
    quotes.push("They said artificial sweeteners were safe, WMDs were in Iraq and Anna Nicole married for love... they said.");
    quotes.push("If the Georgia coach is implying any intent on our part to break the rules, he is barking up the wrong tree.");
    quotes.push("Suggestion to my Rocky Top colleague, rather than lunch in Florida you might spend your time and focus attending to your present team.");
    quotes.push("I have a memory like an elephant. I never forget.");
    
        
    console.log("quotes length::" + quotes.length);
    
    var randomNum=getRandomInt(0,quotes.length-1);
    console.log("randomNum::" + randomNum);
    
    speechOutput = quotes[randomNum];
    //repromptText = "You can ask me another Card like DiscoverMore?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function stop(intent, session, callback) {
    var cardTitle = "Coach Harbaugh Says Go Blue";
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = "Go Blue";
    //repromptText = "You can ask me another Card like DiscoverMore?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + output + "</speak>"
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildSpeechletResponseV2(title, voiceOutput,cardOutput, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "SSML",
            ssml: "<speak>" + voiceOutput + "</speak>"
        },
        card: {
            type: "Simple",
            title: title,
            content: cardOutput
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}