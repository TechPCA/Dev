//This is the main content generator, takes a UUID of a DynamoDB config object.

function fGetIndexDefault (event, context) {

  //For now, just push out HTML to test:
  const vHTMLOut = `
  <html>
    <style>
      h1 { color: #660066; }
    </style>
    <body>
      <h1>NOTHING TO SEE HERE</h1>
    </body>
  </html>`;

  const vResponseOut = {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: vHTMLOut,
  };

  return vResponseOut;
}


module.exports.getIndexDefault = (event, context, callback) => {

  let vOut = fGetIndexDefault(event, context);

  // callback is sending HTML back
  callback(null, vOut);
};