// Middleware function to validate request body using Joi
module.exports  = function (schema) {
  // schema(Generic placeholder) is passed as an argument to the middleware function
  // This allows us to use different schemas for different routes
  // without having to create separate middleware functions for each one.
  // The schema is used to validate the request body against the defined rules.
  // If the validation fails, an error response is sent back to the client.
  // If the validation passes, the request is allowed to proceed to the next middleware or route handler.
  return function (req, res, next) {
    // req, res, next are the standard parameters for Express middleware
    // req: The request object, which contains information about the HTTP request made by the client.
    // res: The response object, which is used to send a response back to the client.
    // next: A function that, when called, passes control to the next middleware function in the stack.
    // It is used to indicate that the current middleware has completed its task and that the next middleware should be executed.

    const { error } = schema.validate(req.body);
    // Validate the request body against the schema
    // The validate method returns an object containing the validation result.
    // If validation fails, the error property will contain the details of the validation error.
    // If validation passes, the error property will be undefined.
    // req.body contains the data sent in the request body, which is validated against the schema.
    // The validate method is called on the schema object, passing in req.body as the data to be validated.
    // The result of the validation is stored in the error variable.

    if (error) {
      return res.status(400).json({ message: error.details[0].message }); // If there is a validation error, send a 400 Bad Request response with the error message
      // The error.details array contains detailed information about the validation error.
      // error.details[0].message provides a human-readable error message describing the validation failure.
      // This message is sent back to the client in the response body.
      // The status code 400 indicates that the request was malformed or invalid.
      // The response is sent as a JSON object containing the error message.
      // This allows the client to understand what went wrong with the request and how to fix it.
      // The client can then correct the request and resend it to the server.
      // This is a common pattern in RESTful APIs to handle validation errors.
    }

    next(); // move on if everything is valid
  };
};
