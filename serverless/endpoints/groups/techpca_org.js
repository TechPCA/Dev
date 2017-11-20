// All this does is call the main entry Lambda function with a UUID specific to TechPCA.org

console.log('Loading: techpca_org.js...');

'use strict';

function fGetIndex (event, context, callback) {

  const cAWS = require('aws-sdk');

  const cS3 = new cAWS.S3;

  var vHTMLOut =  `
  <html>
    <body>
      Bob
    </body>
  </html>`;

  var vParamsS3 = {
    Bucket: "techpca-public",
    Key: "group/FC210BA9-8BBA-4B05-BA2F-349F07D7F8C0/index.html"
  }


  //WARNING: we learned the hard way this is ASYNC, so put the return inside or do something that Matt knows about "promises"
  cS3.getObject(vParamsS3, function(err, data) {
    if (err) {
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
      console.log("ERROR!!!", err, err.stack); // an error occurred

      // callback(new Error('ERROR: Failure with S3.getObject()')); //don't do this, instead load the error page
    }
    else {
      console.log(data);
      vHTMLOut = data.Body.toString('utf-8');
      console.log("SUCCESS: vHTMLOut = " + vHTMLOut );
    }

    console.log("AFTER: vHTMLOut = " + vHTMLOut);

    const vResponseOut = {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
      },
      body: vHTMLOut,
    };

    callback(null, vResponseOut);

  });



}


module.exports.getIndex = (event, context, callback) => {

  let vOut = fGetIndex(event, context, callback);

  //callback() -- DO NOT do this here, otherwise it'll return once the fGetIndex waits

};
