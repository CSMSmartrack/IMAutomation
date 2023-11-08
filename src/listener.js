Webex = require('webex');

const { fonts } = require('../util/fonts');


var axios = require("axios"); // Promise based HTTP client for node.js to send HTTP requests
const https = require('https');



// Smartsheet module and client initialization
var client = require("smartsheet");
var smartsheet = client.createClient({ accessToken: "Bearer M7h8g1OVabn2BR2G5nfAhaT9QkyPOM0KX0924" });


let webex;

/**
 * This is used to keep track of the number of running listeners.
 * When a listener is started, the number goes up. When Ctrl+C is
 * pushed, then listeners are stopped 1 by 1, and the number decreases.
 * Only once it hits 0, the process is terminated and the application exits.
 * Without this it is either exiting too early without stopping all listeners,
 * or not exiting.
 * */
let runningListeners = 0;


/**
 * @type Object containing access_token: String, port: int,
 * selection [resource:String, event:String]
 *
 * */
let specifications = {};


function verifyAccessToken(accessToken) {

    _initializeWebex(accessToken);

    return new Promise((resolve, reject) => {

        webex.people.get('me').then(person => {
            resolve(person);

        }).catch(() => {
            reject('not authenticated');
        }
        );
    });

}

/**
 * @param specs object with resource and event
 * @param resource object describing the resource to register
 *
 * */
function runListener(specs, resource) {

    specifications = specs;
    const event = specs.selection.event;
    const resource_object = resource;

    _startListener(resource, event);

    //Ctrl+C pushed for exit
    process.on('SIGINT', () => {

        //nneds to run first to deregister listeners
        _stopListener(resource_object, event);

        if (runningListeners === 0) {
            //all listeners were stopped
            process.exit(0);
        }

    });

}

function _initializeWebex(accessToken) {
    webex = Webex.init({
        credentials: {
            access_token: accessToken
        }
    });
}

/**
 * Starts a websocket listener for the selected resource
 * and event.
 *
 * */
function _startListener(resource, event) {
    const resource_name = resource.description;

    runningListeners++;

    // register the listener for events on the messages resource
    webex[resource_name].listen().then(() => {
        console.log(fonts.info(
            `Listening for events from the ${resource_name} resource`));

        //need to register a handler for each event type
        if (event === 'all') {
            //each event needs its own handler
            //if user asked for all cycle through each
            //event type and register each handler
            for (let event_name of resource.events) {
                if (event_name === 'all') {
                    continue;
                }
                // Register a handler to forward the event
                webex[resource_name].on(event_name, event_object => _forwardEvent(event_object));
                console.log(fonts.info(
                    'Registered handler to forward  ' +
                    fonts.highlight(`${resource_name}:${event_name}`) + ' events'));
            }
        } else {
            // Register a handler to forward the event
            webex[resource_name].on(event, event_object => _forwardEvent(event_object));
            console.log(fonts.info(
                'Registered handler to forward  ') +
                fonts.highlight(`${resource_name}:${event}`) + ' events');
        }
    }).catch(reason => {
        console.log(fonts.error(reason));
        process.exit(-1);
    });
}

function _stopListener(resource, event) {
    const resource_name = resource.description;

    runningListeners--;

    console.log(fonts.info(
        `stopping listener for ${resource_name.toUpperCase()}:${event.toUpperCase()}`)
    );
    // turn off the event listener
    webex[resource_name].stopListening();
    // deregister the handler(s) for this resource's event(s)
    if (event === 'all') {
        for (let event_name of resource.events) {
            if (event_name === 'all') {
                continue;
            }
            webex[resource_name].off(event_name);
        }
    } else {
        webex[resource_name].off(event);
    }
}

/**
 * Routes incoming request to localhost:port.
 *
 * @param event JSON string of request
 * */
function _forwardEvent(event_object) {
    let event = JSON.stringify(event_object);

    //logging info to the console
    console.log(fonts.info(
        fonts.highlight(`${event_object.resource}:${event_object.event}`) +
        ' received'));

/*
    //gathering some details
    const options = {
        hostname: specifications.target,
        port: specifications.port,
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.from(event).length
        }
    };

    //creating the forward request
    const req = http.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
    });

    req.on('error', error => {
        console.log(fonts.error(error.message));
    });

    //sending the event
    req.write(event);
    req.end();
*/
    console.log(fonts.info(`event forwarded to ${specifications.target}:${specifications.port}`));
    console.log(fonts.info(event));

	var rowId=event_object.data.text
	
	
	
    var sheetId = 4551015933470596
			
	
	//var fetchRowResp = await axios(config)

    var columnsMD=
  {
      "inProduction" : 4219677250480004, // prod MasterData In Production 
      "accountName" : 5908527110743940, // ACCOUNT NAME
      "partnerName" : 5345577157322628, // Partner Name
      "region" : 2195414876219268, // Region
      "migratedFrom" : 3466239367505796, // Migrated From
      "migratedFromOther" : 3217921538320260, // Migrated from Non-Cisco On-Prem?
      "csmEffort" : 8590265706407812, // CSM Effort
      "a2qApprovedDate" : 3428692658546564, // A2Q Approved
      "csmAssignedDate" : 1642410917816196,
      "kickoffDate" : 6471477064165252,
      "tenantCreatedDate" : 5162671847827332,
      "voiceConfiguredDate" : 2910872034142084,
      "tenantDeliveredDate" : 3196114875770756,
      "uatCompletedDate" : 1784972127299460,
      "expectedGoLiveDate" : 8160326924429188, // "Phase 1 Go-Live Date TARGET"
      "actualGoLiveDateP1" : 3677017964078980, // "Phase 1 Go-Live Date ACTUAL"
      "actualGoLiveDateP2": 7315901994297220, // Phase 2 Go-Live Date (projected or actual)
      "telephony" : 2194901837342596, // Telephony Option
      "primaryCSM" : 8230470254126980, // Primary CSM
      "secondaryCSM" : 8861334306613124, // Secondary CSM
      "version" : 8659204723500932,
      "agentsOrdered" : 7597376971007876, //  Agents Ordered
      "standAgentsOrdered" : 5709935175591812, //  Standard Agents Ordered
      "premAgentsOrdered" : 3458135361906564, //  Premium Agents Ordered
      "subscriptionId" : 2660201875695492, //  Subscription  (WxCC Only)
      "subscriptionTerm" : 1319631221745540, //  Subscription Term (mos)
      "autoRenewTerm" : 8390554496067460, //  Auto Renewal Term
      "orderStatus" : 3195331419629444,// Order Status
      "licenseType" : 5768612146374532, //  License Type (Named/Concurrent)
      "newEndDateTime" : 7274761721014148, // "New Subscription End Date"
      "renewdAtEndofTerm" : 2771162093643652, // "Renewed at End of Term?"        
      "tryBuy" : 3168941982934916, // "Try and Buy?"
      "mrrMonthlyCost" : 959117586130820, // "MRR (Total Monthly Cost)"
      "mrrCurrency" : 3915936013019012, // "MRR Currency"

      "mrrIVRAgnet" : 8277466980607876, // "MRR (IVR + Agents)"
      "mrrTotalAddons" : 3674038578505604, // "MRR Add-ons"
      "mrrTotalIMI" : 8177638205876100, // "MRR Digital Channels"
      "TotalIvrPorts" : 5925838392190852, // "IVR Ports"
      "addonsOrdered" : 859288811399044, // "Add-ons (Ordered)"
      "channelsOrdered" : 5362888438769540, // "WxCC Channels (Ordered)"

      
      "server" : 50794662782852, // App Center
      "a2qId" : 8283912226006916, // A2Q ID
      "orgID" : 7163801503065988,
      "time2Production" : 771902286391172,
      "channels" : 2807474561542020, // WxCC Channels (Live)
      "features" : 7311074188912516, // Features (Live)
      "addons" : 1681574654699396, // Add-ons (Live)  
      "crmIntegration" : 6698501464713092, // Integration (Live)        
      "security" : 4688497822984068, // Security Settings (Live)
      "initStartDateTime" : 2235319390785412, // Initial Subscription Start Date
      "initEndDateTime" : 6949130755958660, // Initial Subscription End Date
      "ccwBsft" : 7122111681587076, // prod From A2Q - Order Platform
      "orderId" : 1492612147373956, // prod BSFT Quote ID, CC1 Deal ID or CCW Weborder ID
      "partnerCSM" : 16121819621252, // prod Partner CSM
      "salesContact" : 5890119719774084, // prod Sales Contact
      "partnerContact" : 1614723180455812, // prod Partner Sponsor
      //"partnerContactEmail" : 6118322807826308, // prod Partner Sponsor Contact Info
      "accountSentiment" : 3656727297058692, // prod Account Sentiment
      "onboardingStatus" : 8244880704071556, // prod Onboarding Status
      "overallComplete" : 1686402460084100, // prod Overall % Complete
      "cancellationRisk" : 8861815842072452, // prod Cancellation Risk
      "statusSummary" : 8441801901139844, // prod Status Summary
      "orderDate" : 496430398891908, // prod ORDER DATE
      "engagementStatus" : 2812302366926724, // prod "ENGAGEMENT STATUS"
      "cancelDate" : 8687422121764740, // "Cancel Date"
      "segment" : 7824914410432388, // "Segment"
      "vertical" : 6699014503589764, // "Vertical"
      "goLiveMonth" : 8088125844023172, // "Go-Live Month"
      "goLiveYear" : 769776449546116, // "Go-Live Year"
      "goLiveQtr" : 3407855186405252, // "Go-Live Qtr"
      "cancelReason" : 276829052397444, // "Cancel Reason"
      "time2Deliver" : 8731279748294532, // "Time2Deliver"
      "daysSinceOrder" : 5405199591335812, // "DaysSinceOrder"
      "daysSinceKickoff" : 4244321470834564, // "DaysSinceKickoff"
      "time2Provision" : 8090251680868228, // "Time2Provision"
      "goLiveLapse" : 8747921098205060, // "GoLive_Lapse"
      "duration" : 70947823740804, // "Duration"
      "customerContact" : 142707988424580, // "Customer Sponsor"
      //"customerContactEmail" : 4646307615795076, // "Customer Sponsor Contact Info"
      "tcv" : 8948438275516292, // "TCV"
      "mediaLayer": 4366121827258244, //Media Layer
      
      "setupAssist" : 2411372520728452, // Setup Assist
      "setupAssistDeploymentType" : 4902198538725252, // Setup Assist Deployment Type
      "setupAssistEngineer" : 1285472613885828, // Setup Assist - CX Deployment Engineer
      "setupAssistProjectManager" : 2650398725040004, // Setup Assist - CX Project Manager
      "setupAssistWOID" : 5789072241256324, // Setup Assist WOID
      "serviceType" : 1524498818197380, // Day2 Service Type
     

      "partnerOnboardingResponse" : 1870893840394116, // Partner Onb/Mig NPI
      "customerOnboardingResponse" : 6374493467764612, // Cust Onb/Mig NPI
      "partnerEngagementResponse" : 4122693654079364, // Partner Engag NPI
      "customerEngagementResponse" : 8626293281449860, // Cust Engag NPI
      "customerUnsubscribe":3872599721699204, // Customer Unsubscribed
      "partnerUnsubscribe":6124399535384452, // Partner Unsubscribed
      "partnerOnboardingSentDate" : 463518956840836, // Partner Onb Sent
      "customerOnboardingSentDate" : 4967118584211332, // Customer Onb Sent
      "partnerEngagementSentDate" : 2715318770526084, // Partner Engag Sent
      "customerEngagementSentDate" : 7218918397896580, // Customer Engag Sent
      "partnerOnboardingRetry" : 5585788322768772, // Parter Onb Retries
      "customerOnboardingRetry" : 7837588136454020, // Cust Onb Retries
      "partnerEngagementRetry" : 3333988509083524, // Parter Engag Retries
      "customerEngagementRetry" : 2208088602240900, // Customer Engag Retries
      "webexMsgId" : 5844488027432836, // Webex MSG ID
      "webexCardMsgId" : 3219427017680772, // Webex Card MsgID
      "gartnerPeerReview" : 4504640521824132, //Gartner Peer Review
      "reachForgartnerReview" : 2986801545144196, // Reach Out For Gartner Peer Review
      
      //"customerCCWName" : 581029270081412, // Customer Name from CCW
      "bookedQty" : 5982800045887364, // Agent Ordered (original booked qty)
      "agentsOrderedGoLive" : 8709262800801668,   // Agents Ordered (At Go Live)     

  };

    axios.get("https://api.smartsheet.com/2.0/sheets/" + sheetId + "/rows/" + rowId, {headers: {
        'Authorization': "Bearer M7h8g1OVabn2BR2G5nfAhaT9QkyPOM0KX0924"
    }
    }).then(resp => {
        var mdObj = new Object();
        //Get all required column values
        for (var key in columnsMD) {
            if (key == "migratedFrom" || key == "migratedFromOther" || key == "csmEffort") {
              mdObj[key] = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0].displayValue;
            } else if (key == "primaryCSM" || key == "secondaryCSM") {
              mdObj[key] = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0];
            } else if (key == "partnerCSM" || key == "partnerContact" || key == "customerContact") {
              mdObj[key] = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0].displayValue;
              mdObj[key + "Email"] = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0].value;
      
              // mdObj[key].value = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0].value;
              // mdObj[key].displayValue = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0].displayValue;
            } else {
              mdObj[key] = resp.data.cells.filter((col) => col.columnId == columnsMD[key])[0].value;
            }
        }

        console.log("DATA: ", mdObj)


        var appCenter
        var services=["Portal", "Inbound", "Outbound", "Flow Control", "Agent Application", "Analyzer", "Call Recording"]

        if(mdObj.mediaLayer = "RTMS"){
          services.push("RTMS")
        }

        switch(mdObj.addOns){
          case "Acqueon":
            services.push("Outbound Campaigns")
            break;
          
          case "Calabrio/WFO":
            services.push("WFO/WFM/Calabrio")
            break;

          case "Inference":
            services.push("Inference")
            break;

          default:
        }

        switch(mdObj.features){
          case "BRE":
            services.push("Business Rules Engine")
            break;
          
          case "CCAI Virtual Agent":
            services.push("Google Voice Virtual Agent")
            break;

          case "TTS":
            services.push("Google Text To Speech")
            break;

          default:
        }

        
        switch(mdObj.channels){
          case "SMS":
            services.push("SMS - IMI")
            break;
          
          case "Chat - Digital":
            services.push("Chat - IMI")
            break;

          case "Email - Digital":
            services.push("Email - IMI")
            break;
          
          case "Facebook":
            services.push("FB - IMI")
            break;

          default:
        }

        switch(mdObj.server){
          case "PRODCA1":
            appCenter="WxCC 2.0 CA1"
            break;
          case "PRODUS1":
            appCenter="WxCC 2.0 US1"
            break;
          case "PRODEU1":
            appCenter="WxCC 2.0 EU1"
            break;
          case "PRODEU2":
            appCenter="WxCC 2.0 EU1"
            break;
          case "PRODJP1":
            appCenter="WxCC 2.0 JP1"
            break;
          case "PRODANZ1":
            appCenter="WxCC 2.0 ANZ1"
            break;
          default:
            appCenter="ERROR"
        }


        //Creation of partner
        //imsFunctions.createPartner(inputs.partnerName, inputs.partnerCsmEmail)
        mdObj.partnerName="testGorka999"
        mdObj.partnerCSMEmail="testGorka999@gmail.com"

        var body=
        {
            "universal_partner_id" : "NA",
            "name" : "testGorka999",
            "type" : "SP",
            "email" : "testGorka999@gmail.com",
            "primary_psam": "NA",
            "secondary_psam": "NA",
        } 

        axios.get("https://solas-ims-lnx.cisco.com/api/partners", {
            auth: {
                username: "im_smartrack",
                password: 'C1scoIPCC123!#'
            }
        }).then(resp => {
            console.log(resp)
        })

        

        //Creation of tenant
        //imsFunctions.createTenant(inputs.accountName, appCenter)

        //Creation of customer
        //imsFunctions.createCustomer(inputs.accountName, inputs.partnerName, partnerName.customerContact, services)

    }).catch(error => {    
        console.log(error);
    });


        /*
    const req = https.request(options, res => {
        console.log(`statusCode: ${res.statusCode}`);
      
        res.on('data', d => {
          process.stdout.write(d);
        });
      });
      */
}

		
	



module.exports = {
    runListener,
    verifyAccessToken
};
