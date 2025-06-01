const serverless = require("serverless-http");
const app = require("./server"); // Import your existing Express app

// const server = awsServerlessExpress.createServer(app);

module.exports.handler = serverless(app); // Export the handler for AWS Lambda

// exports.handler = (event, context) => {
//   return awsServerlessExpress.proxy(server, event, context);
// };
