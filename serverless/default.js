'use strict';  //TODO: do this?

//TODO: need header

//TODO: better way to do this?
const cFileName = "default.js";


//TODO: move this somewhere else

//This is the main content generator, takes a UUID of a DynamoDB config object.

const cTPCAUtilsClass = require("./utils/techpca_utils.js");
const cTPCAUtils = new cTPCAUtilsClass();

//TODO: load this from DynamoDB and switch from lambda ARN to UUID w/ lookup in DynamoDB
const cDictREsToUUIDGroup = {
  //WARNING: make all keys lowercase!
  "dev.techpca.org": 'techpca-dev-endpoints-groups-techpca_org-getIndexDev',
  "www.techpca.org": 'techpca-dev-endpoints-groups-techpca_org-getIndexPro'
};


// noinspection JSUnusedLocalSymbols
function fGetIndexDefault(event, context, callback) {
  if (cTPCAUtils.fIsDebug()) {
    cTPCAUtils.fLogFunctionEventContext(cFileName + ": fGetIndexDefault()", event, context);
  }

  let vTPCAOut = {};  //TODO: what's our TLA/FLA for our objects?

  let vStrHost = event["headers"]["Host"];

  const cAWS = require('aws-sdk');
  const cLambda = new cAWS.Lambda({
//    region: 'us-east-1' //if you want to change to your region
  });


  //TODO: clean this up:


  let vLambdaName = cDictREsToUUIDGroup[vStrHost];
  if (vLambdaName === undefined) {
    //then try with www. at the start
    let vStrHostWithWWW = "www." + vStrHost;
    vLambdaName = cDictREsToUUIDGroup[vStrHostWithWWW];
  }

  if (vLambdaName) {
    cLambda.invoke(
      {
        FunctionName: vLambdaName,
        InvocationType: "RequestResponse",
        Payload: JSON.stringify(event, context)
      },
      function (error, data) {


        if (cTPCAUtils.fIsDebugVerbose()) {
          cTPCAUtils.fLog(cFileName + ": fGetIndexDefault(): PROCESSING data returned by lambda, data.Payload = "+data.Payload);
        }

        if (error) {
          vTPCAOut = cTPCAUtils.fGetTPCAReturnObject(
            true, //aBoolError
            "3-171202-2021", // aStrCode: DevID-YYMMDD-HHMM
            error, //aStrMessage
            null //aResponse
          );
        }
        else if (!data) {
          vTPCAOut = cTPCAUtils.fGetTPCAReturnObject(
            true, //aBoolError
            "3-171202-2022", // aStrCode: DevID-YYMMDD-HHMM
            "!data ???", //aStrMessage
            null //aResponse
          );
        }
        else if (data.Payload) {  //SUCCESS!!

          let vResponseOut = null;
          try {
            let vStrDataPayload = data.Payload.toString();
            vResponseOut = JSON.parse(vStrDataPayload);

            vTPCAOut = cTPCAUtils.fGetTPCAReturnObject(
              false, //aBoolError
              "0", // aStrCode: DevID-YYMMDD-HHMM
              "", //aStrMessage
              vResponseOut //aResponse
            );
          } catch (e) {
            let vStrCode = "3-171203-0201";
            let vStrMessage = "Failed to parse data.Payload, error = "+e+"   &&&  data.Payload = "+data.Payload;
            cTPCAUtils.fErrorReport(vStrCode, vStrMessage);

            vTPCAOut = cTPCAUtils.fGetTPCAReturnObject(
              true, //aBoolError
              vStrCode, // aStrCode: DevID-YYMMDD-HHMM
              vStrMessage, //aStrMessage
              null //aResponse
            );
          }

          let vResponseOutFromTPCAOut = cTPCAUtils.fGetHTMLResponseFromTPCAReturnObject(vTPCAOut);

          if (cTPCAUtils.fIsDebugVerbose()) {
            cTPCAUtils.fLog(cFileName+": fGetIndexDefault: SUCCESS: vResponseOutFromTPCAOut: "+vResponseOutFromTPCAOut+"      &&&    JSON.stringify(vResponseOutFromTPCAOut) = "+JSON.stringify(vResponseOutFromTPCAOut));
          }

          //cTPCAUtils.fCallbackForHTMLResponseWithTPCAReturnObject(vTPCAOut, callback); //TODO
          // callback(null, vTPCAOut.response);
          callback(null, vResponseOutFromTPCAOut);
        }
        else {
          if (error) {
            vTPCAOut = cTPCAUtils.fGetTPCAReturnObject(
              true, //aBoolError
              "3-171202-2023", // aStrCode: DevID-YYMMDD-HHMM
              "data.Payload doesn't exist?  data: " + JSON.stringify(data), //aStrMessage
              null //aResponse
            );
          }
        }
      });

  } else {//ERROR: unhandled

    cTPCAUtils.fErrorReport("3-171202-2209", "fGetIndexDefault: UNHANDLED domain: " + vStrHost);

    const vHTMLOut = `
  <html>
    <style>
      h1 { color: #660066; }
    </style>
    <body>
      <h1>Nothing to see here....</h1>
    </body>
  </html>`;

    let vResponse = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: vHTMLOut,
    };

    vTPCAOut = cTPCAUtils.fGetTPCAReturnObject(
      false, //aBoolError
      "0", // aStrCode: DevID-YYMMDD-HHMM
      "", //aStrMessage
      vResponse //aResponse
    );

    if (cTPCAUtils.fIsDebug()) {
      cTPCAUtils.fLog(cFileName + ": fGetIndexDefault: UNHANDLED DOMAIN: calling callback with vTPCAOut = " + JSON.stringify(vTPCAOut));
    }

    // cTPCAUtils.fCallbackForHTMLResponseWithTPCAReturnObject(vTPCAOut, callback);
    //cTPCAUtils.fCallbackForHTMLResponseWithTPCAReturnObject(vTPCAOut, callback); //TODO
    callback(null, vTPCAOut.response);


  } //end else ERROR: unhandled

  //Anything after this will execute BEFORE the invoke() is called, so don't do anything here.

  if (cTPCAUtils.fIsDebug()) {
    cTPCAUtils.fLog(cFileName + ": fGetIndexDefault: FINISHED");
  }
}


module.exports.getIndexDefault = (event, context, callback) => {
  if (cTPCAUtils.fIsDebug()) {
    cTPCAUtils.fLogFunctionEventContext(cFileName + ": getIndexDefault()", event, context);
  }

  // Returns standard response object:
  //   {  error: BOOL,  code: STR, message: STR, response: RESPONSE_OBJECT }
  fGetIndexDefault(event, context, callback);

};