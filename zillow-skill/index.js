/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * The Intent Schema, Custom Slots, and Sample Utterances for this skill, as well as
 * testing instructions are located at http://amzn.to/1LzFrj6
 *
 * For additional samples, visit the Alexa Skills Kit Getting Started guide at
 * http://amzn.to/1LGWsLG
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
var https = require('https');
exports.handler = function (event, context) {
    try {
        console.log("hello 10 event.session.application.applicationId=" + event.session.application.applicationId);
        console.log("event.request.type::" + event.request.type);
        console.log("event.request::"+event.request);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        
        if (event.session.application.applicationId !== "amzn1.ask.skill.7b48f239-8dd3-4bcf-9651-48b63a801500") {
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

    console.log("intentName::"+intentName);
    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ((intentRequest.intent.name === undefined) ||
    (intentName === null) || (intentName == "undefined"))  {
       console.log("undefined loop::"+intentName);    
       getWelcomeResponseV2(callback);
    }
    else if (intentRequest.intent.name === "Chase") {
        console.log("Chase he he he::"+intentName);
        chaseFreedom(intent, session, callback);
        return;
    }
    else if (intentRequest.intent.name === "cardtype") {
        console.log("cardtype he he he::"+intentName);
        CardType(intent, session, callback);
        return;
    }
    else if ("Discover" == intentName) {
        console.log("discover::"+intentName);
        discoverIt(intent, session, callback);
        return;
    }
     else if ("cashback" == intentName) {
        console.log("cashback::"+intentName); 
        getWelcomeResponseV2(callback);
        return;
    }
    else if ("AMAZON.StopIntent" == intentName) {
         console.log("stop::"+intentName);
         stop(intent, session, callback);
          return;
        //PlainTextOutputSpeech outputSpeech = new PlainTextOutputSpeech();
     //outputSpeech.setText("Goodbye");
     //return SpeechletResponse.newTellResponse(outputSpeech);
    } 
    else if ("AMAZON.CancelIntent" == intentName) {
        console.log("cancel::"+intentName);
        stop(intent, session, callback);
          return;
        } 
    //else if ("DiscoverMore" === intentName) {
    //    discoverMore(intent, session, callback);
    //}
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
    var cardTitle = "Cashback";
    var speechOutput = "Welcome to the Cashback App. " +
        "Please tell me the creditcard issuer like Discover or Chase";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me the creditcard issuer, " +
        "like Discover More Card";
    var shouldEndSession = false;
    console.log("before http call");
    
    var body='';
    //var jsonObject = JSON.stringify(event);

    // the post options
    var optionspost = {
        host: 'www.zillow.com',
        path: '/webservice/GetRateSummary.htm?zws-id=X1-ZWz1fi3ui5ggln_86zet&output=json&state=HI',
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };

    var reqPost = https.request(optionspost, function(res) {
        console.log("statusCode: ", res.statusCode);
        res.on('data', function (chunk) {
            body += chunk;
        });
        //context.succeed('Blah');
        console.log("result back after http call");
        callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
    });

   // reqPost.write(jsonObject);
    reqPost.end();


    console.log("after http call");
    //callback(sessionAttributes,
    //    buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getHelpResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Cashback";
    var speechOutput = "Credit card issuers Discover and Chase are only supported currently. Please say Discover or Chase" ;
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me the creditcard issuer, " +
        "like Discover";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function getWelcomeResponseV2(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Cashback";
    var speechOutput = "" +
        "Please select the creditcard issuer, Discover or Chase";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please select the creditcard issuer, Discover or Chase";
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function discoverMore(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = "5% cashback bonus at Amazon.com,Department Stores and Sam's Club till Dec 2016 for Discover More and Discover It credit cards";
    //repromptText = "You can ask me another Card like ChaseFreedom?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function discoverIt(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = "5% cashback bonus at Amazon.com,Department Stores and Sam's Club till Dec 2016 for Discover More and Discover It credit cards";
    //repromptText = "You can ask me another Card like ChaseFreedom?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function chaseFreedom(intent, session, callback) {
    var cardTitle = intent.name;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = "5% cashback bonus at Department stores, Whole sale clubs like Costco and Drug stores till Dec 2016 for Chase freedom credit card. Chase extended the offer till Dec 2016 on Costco which is cool.";
    //repromptText = "You can ask me another Card like DiscoverMore?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function CardType(intent, session, callback) {
    var cardTitle = "Cashback App - Card Type";
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    if((intent.slots.issuer.value!=null) && (intent.slots.issuer.value.toUpperCase() === "Discover".toUpperCase()))
    {
        speechOutput = "5% Cashback Bonus on up to $1,500 in purchases at Amazon.com,Department Stores and Sam's Club till Dec 2016";
    }
    else if((intent.slots.issuer.value!=null) && (intent.slots.issuer.value.toUpperCase() === "Chase".toUpperCase()))
    {
        speechOutput = "5% Cashback Bonus on up to $1,500 in purchases at Department stores, Whole sale clubs like Costco and Drug stores till Dec 2016 on Chase freedom credit card. Chase extended the offer till Dec 2016 on Costco which is cool.";
        
    }
    else
    {
         speechOutput = intent.slots.issuer.value + " issuer is not supported. Only Discover and Chase are supported";
         repromptText = "Please select a card issuer like Discover or Chase";
         shouldEndSession = false;
        
    }
    
  
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}



function stop(intent, session, callback) {
    var cardTitle = "Thank you for using Cashback App";
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = true;
    var speechOutput = "";
    
    speechOutput = "Thank you for using Cash back App";
    //repromptText = "You can ask me another Card like DiscoverMore?";
    
    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}


/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setColorInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var favoriteColorSlot = intent.slots.Color;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (favoriteColorSlot) {
        var favoriteColor = favoriteColorSlot.value;
        sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = "I now know your favorite color is " + favoriteColor + ". You can ask me " +
            "your favorite color by saying, what's my favorite color?";
        repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
    } else {
        speechOutput = "I'm not sure what your favorite color is. Please try again";
        repromptText = "I'm not sure what your favorite color is. You can tell me your " +
            "favorite color by saying, my favorite color is red";
    }

    callback(sessionAttributes,
         buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createFavoriteColorAttributes(favoriteColor) {
    return {
        favoriteColor: favoriteColor
    };
}

function getColorFromSession(intent, session, callback) {
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (session.attributes) {
        favoriteColor = session.attributes.favoriteColor;
    }

    if (favoriteColor) {
        speechOutput = "Your favorite color is " + favoriteColor + ". Goodbye.";
        shouldEndSession = true;
    } else {
        speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color " +
            " is red";
    }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
         buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "Cashback App - " + title,
            content: "Cashback App - " + output
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