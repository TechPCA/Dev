//This is the main content generator, takes a UUID of a DynamoDB config object.

function fGetIndex (event, context) {

  //Step 1:  Get the DynamoDB object for the UUID
  // check for GET params and use if available
  if (event.queryStringParameters && event.queryStringParameters.uuidGroup) {
    vHTMLDynamic = `<p>Hello World v2.0:  <i><b>${event.queryStringParameters.uuidGroup}</b></i>!</p>`;
  } else {
    //TODO: error
  }

  //Step 2:  Invoke the lambda functions described by the object


  //Step 3: combine into a single big HTML and return as HTML

  //For now, just push out HTML to test:
  const vHHTMLOut = `
  <html>
    <style>
      h1 { color: #660066; }
    </style>
    <body>
      <h1>Landing Page</h1>
      LieTest:   ${vHTMLDynamic}
    </body>
  </html>`;

  const vResponseOut = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: vHHTMLOut,
  };

  return vResponseOut;
}


module.exports.getIndex = (event, context, callback) => {

  let vOut = fGetIndex(event, context);

  // callback is sending HTML back
  callback(null, vOut);
};