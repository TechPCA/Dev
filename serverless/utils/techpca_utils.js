const gDEBUG = true;  //TODO: this needs to be an ENV var
const gDEBUGVERBOSE = true;  //TODO: this needs to be an ENV var


//TODO: better way to do this?
const cFileName = "utils/techpca_utils.js";


//TODO: requirements should be global?
const cAWS = require('aws-sdk'); //put into shared header!

//TODO: automatically assign this
const cStrPackageName = 'TechPCA-Utils';

//TODO: need global constants or ENV vars to use e.g. the error notification SNS should be an env var



class TPCAUtils {

  constructor() {

  }

  // noinspection JSMethodCanBeStatic
  fIsDebug () {
    //TODO: check args
    return gDEBUG;
  }

  // noinspection JSMethodCanBeStatic
  fIsDebugVerbose () {
    //TODO: check args
    return gDEBUGVERBOSE;
  }

  // noinspection JSMethodCanBeStatic
  fLog(aStr) {
    console.log(aStr);
  }

  // noinspection JSUnusedGlobalSymbols
  fLogIfDebug (aStr) {
    if (this.fIsDebug()) {
      this.fLog(aStr);
    }
  }

  fLogFunctionEventContext(aStrFunctionName, aEvent, aContext) {
    if (this.fIsDebug()) {
      let vStrHost = aEvent["headers"]["Host"];
      let vStrPath = aEvent["path"];
      console.log(aStrFunctionName+"HOST/PATH: "+vStrHost+vStrPath);
      console.log(aStrFunctionName+"EVENT: "+JSON.stringify(aEvent));
      console.log(aStrFunctionName+"CONTEXT: "+JSON.stringify(aContext));
    }
  }

  // noinspection JSMethodCanBeStatic
  fGetTPCAReturnObject (aBoolError, aStrCode, aStrMessage, aResponse) {
    //TODO: check args

    if (this.fIsDebugVerbose()) {
      this.fLog(cFileName + ": fGetTPCAReturnObject(): START: aBoolErr = "+aBoolError+", aStrCode = "+aStrCode+", aStrMessage = "+aStrMessage+", aResponse = "+aResponse);
    }

    //TODO: Create a class for this:
    let vOut =  { error: aBoolError, code: aStrCode, message: aStrMessage, response: aResponse };

    if (this.fIsDebugVerbose()) {
      this.fLog(cFileName+": fGetTPCAReturnObject: vOut = "+JSON.stringify(vOut));
    }

    return vOut;
  }


  // noinspection JSUnusedGlobalSymbols
  fErrorReportWithTPCAResponse (aTPCAResponse) {
    //TODO: check args
    return this.fErrorReport(aTPCAResponse.code, aTPCAResponse.message);
  }


  fErrorReport (aStrCode, aStrMessage) {

    const cSNS = new cAWS.SNS();

    //TODO: pull in this ARN from the environment

    let vStrMessage = cStrPackageName+": fErrorReport: Error # "+aStrCode+": "+aStrMessage;

    console.log(vStrMessage);

    cSNS.publish({
      TopicArn: "arn:aws:sns:us-east-1:358447657268:TechPCA-Dev--Error",
      Message: vStrMessage
    }, function(err, data) {
      if(err) {
        console.log('error publishing to SNS: '+vStrMessage+"  -- with data: "+data);
      } else {
        console.log('message published to SNS: '+vStrMessage+"  -- with data: "+data);
      }
    });
  }


  fGetHTMLResponseFromTPCAReturnObject(aTPCAReturnObject) {
    if (this.fIsDebugVerbose()) {
      this.fLog(cFileName + ": fGetHTMLResponseFromTPCAReturnObject(): aTPCAReturnObject = "+JSON.stringify(aTPCAReturnObject));
    }

    //TODO: standard error checking for return object having the correct key/values -- to put into our local SDK

    if (aTPCAReturnObject.error) {
      // callback is sending HTML back

      this.fErrorReport(aTPCAReturnObject);

      // This should return an error page:

      //TODO: standard debug switch on/off

      let vHTMLOut = "";

      let vStrTPCAReturnObject = JSON.stringify(aTPCAReturnObject);

      if (this.fIsDebug()) { //DEBUG error
        vHTMLOut =`
<html>
  <style>
    h1 { color: #660066; }
  </style>
  <body>
    <h1>ERROR: ${aTPCAReturnObject.code}: ${aTPCAReturnObject.message}</h1>
    <br/>
    <p>
    ${vStrTPCAReturnObject}
    </p>
  </body>
</html>
`;
      } //end if DEBUG error
      else {
        vHTMLOut =`
<html>
  <style>
    h1 { color: #660066; }
  </style>
  <body>
    <h1>We're sorry, there was an error.  Please contact <a href="mailto:Support@TechPCA.org">Support@TechPCA.org</a> with this error code: #${aTPCAReturnObject.code}</h1>
  </body>
</html>
`;
      } //end else if DEBUG error

      const vResponseOut = {
        statusCode: 200,
        headers: {
          'Content-Type': 'text/html',
        },
        body: vHTMLOut,
      };

      return vResponseOut;

    } else { //aTPCAReturnObject.error == false -- Success -- aTPCAReturnObject.response
      if (this.fIsDebug()) {
        this.fLog(cFileName+": fGetHTMLResponseFromTPCAReturnObject: aTPCAReturnObject = "+JSON.stringify(aTPCAReturnObject));
      }

      // callback is sending HTML back
      return (aTPCAReturnObject.response);
    }

  }


  fCallbackForHTMLResponseWithTPCAReturnObject(aTPCAReturnObject, aCallback) {
    if (this.fIsDebugVerbose()) {
      this.fLog(cFileName + ": fCallbackForHTMLResponseWithTPCAReturnObject(): aTPCAReturnObject = "+JSON.stringify(aTPCAReturnObject));
    }

    let vTPCAReturnObject = aTPCAReturnObject;

    if (!aTPCAReturnObject) {
      this.fLog(cFileName + ": fCallbackForHTMLResponseWithTPCAReturnObject(): ERROR: !aTPCAReturnObject ????");

      vTPCAReturnObject = this.fGetTPCAReturnObject(
        true, //aBoolError
        "3-171202-2340", // aStrCode: DevID-YYMMDD-HHMM
        cFileName+": fCallbackForHTMLResponseWithTPCAReturnObject: !aTPCAReturnObject ???", //aStrMessage
        "" //aResponse
      );
    }

    if (!aCallback) {
      if (this.fIsDebugVerbose()) {
        this.fLog(cFileName + ": fCallbackForHTMLResponseWithTPCAReturnObject(): ERROR: !aCallback ????");
      }
      let vStrError = cFileName+": fCallbackWithTPCAReturnObject: !aCallback ???   aTPCAReturnObject: "+JSON.stringify(aTPCAReturnObject);
      this.fErrorReport("3-171202-2328", vStrError);
    } else {
      let vHTMLResponse = this.fGetHTMLResponseFromTPCAReturnObject(vTPCAReturnObject);

      if (this.fIsDebugVerbose()) {
        this.fLog(cFileName + ": fCallbackForHTMLResponseWithTPCAReturnObject(): SUCCESS: calling callback with vHTMLResponse = "+vHTMLResponse);
      }

      aCallback(null, vHTMLResponse);
    }

  }


  //TODO: function that takes in ANYTHING and returns a debug string for it


}




module.exports = TPCAUtils;
