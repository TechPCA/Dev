'use strict';  //TODO: do this?
//TODO: need header

// All this does is call the main entry Lambda function with a UUID specific to TechPCA.org

//TODO: better way to do this?
const cFileName = "endpoints/groups/techpca_org.js";



const cTPCAUtilsClass = require("../../utils/techpca_utils.js");
const cTPCAUtils = new cTPCAUtilsClass();

// noinspection JSUnusedLocalSymbols
function fGetIndex (event, context, callback, aDictS3Params) {
  if (cTPCAUtils.fIsDebug()) {
    cTPCAUtils.fLogFunctionEventContext(cFileName+": fGetIndex()",event,context);
  }

  const cAWS = require('aws-sdk');

  const cS3 = new cAWS.S3;

  let vHTMLOut =  `
  <html>
    <body>
      Bob
    </body>
  </html>`;

  let vParamsS3 = aDictS3Params;


  //WARNING: we learned the hard way this is ASYNC, so put the return inside or do something that Matt knows about "promises"
  cS3.getObject(vParamsS3, function(err, data) {
    if (err) { //if ERR
      vHTMLOut =  `
  <html>
    <body>
      <h1>ERROR!</h1>
      <h3>Please contact <mailto:"Support@TechPCA.org">Support@TechPCA.org</mailto></h3>
      <br/>
      The error was:
      <br/>`
        + err
        + '     -- stack:  '
        + err.stack
        + `
    </body>
  </html>`;

      cTPCAUtils.fErrorReport(cFileName+": fGetIndex: ERROR: "+err+" -- "+err.stack); // an error occurred
    } //end if ERR
    else {
      // noinspection JSCheckFunctionSignatures
      vHTMLOut = data.Body.toString('utf-8');

      if (cTPCAUtils.fIsDebugVerbose()) {
        cTPCAUtils.fLog(cFileName+": fGetIndex: ELSE: vHTMLOut: "+vHTMLOut);
      }
    } //end else if ERR

    if (cTPCAUtils.fIsDebugVerbose()) {
      cTPCAUtils.fLog(cFileName+": fGetIndex: AFTER: vHTMLOut: "+vHTMLOut);
    }

    const vResponseOut = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: vHTMLOut,
    };

    if (cTPCAUtils.fIsDebugVerbose()) {
      cTPCAUtils.fLog(cFileName+": fGetIndex: Calling Callback: vResponseOut: "+vResponseOut);
    }
    callback(null, vResponseOut);

  } //end function passed to cS3.getObject()
  );//end cS3.getObject()

  if (cTPCAUtils.fIsDebugVerbose()) {
    cTPCAUtils.fLog(cFileName+": fGetIndex: s3.GetObject() was called, now waiting...");
  }

}




module.exports.getIndexDev = (event, context, callback) => {
  if (cTPCAUtils.fIsDebug()) {
    cTPCAUtils.fLogFunctionEventContext(cFileName+": getIndexDev()",event,context);
  }

  let vParamsS3 = {
    Bucket: "techpca-public",
    Key: "group/FC210BA9-8BBA-4B05-BA2F-349F07D7F8C0/index-dev.html"
  };

  // noinspection JSUnusedLocalSymbols
  let vOut = fGetIndex(event, context, callback, vParamsS3);

};


module.exports.getIndexPro = (event, context, callback) => {
  if (cTPCAUtils.fIsDebug()) {
    cTPCAUtils.fLogFunctionEventContext(cFileName+": getIndexPro()",event,context);
  }

  let vParamsS3 = {
    Bucket: "techpca-public",
    Key: "group/FC210BA9-8BBA-4B05-BA2F-349F07D7F8C0/index-pro.html"
  };

  // noinspection JSUnusedLocalSymbols
  let vOut = fGetIndex(event, context, callback, vParamsS3);

};
