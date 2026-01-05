👋
Welcome
Welcome to the Moneroo API documentation.

Moneroo enables businesses to instantly access multiple payment providers primarily in Africa and globally with a single integration. With Moneroo, businesses can give their customers multiple payment options without manually integrating each provider.

This documentation is crafted to offer an in-depth overview of the Moneroo platform and serve as a guide for its integration and usage.

The documentation is structured in a way that first introduces you to fundamental concepts, followed by a deeper dive into the specifics of integration, diverse use cases, and efficient troubleshooting. Welcome to the effortless world of financial transactions with Moneroo where managing both incoming and outgoing payments is effortless, and you can focus on your core business.

Help and Support
Moneroo is designed to provide easy user interaction, but we understand that questions and challenges may occur. Here's how you can access our support:

Support
For any issues with Moneroo integration, contact our support team via email, chat, or phone. We can assist with transaction issues, API calls, or feature comprehension.

Community Forums
Our Slack community is a valuable resource, comprising experienced and novice developers along with Moneroo team members ready to assist you. Check our forums for existing answers before contacting the support team.

Joining the Slack community lets you:

Ask questions and get help.

Share your experiences.

Learn from community members.

Receive updates and announcements.

Provide valuable feedback.

Moneroo API endpoints are secured with API keys, which you can create from the dashboard. You must include your API key in all API requests to the server as a header field.

To interact with the Moneroo API, you must follow each of your requests with an Authorization header including your secret key in the Authorization header. You can manage your API keys from the dashboard.

We generally provide both public and secret keys. Public keys are intended for use from your interface when integrating using JavaScript SDKs and in our mobile SDKs only. By design, public keys cannot modify any part of your account except to initiate transactions. On the other hand, secret keys must remain secret and should not be used publicly. For better safety, always use the secret keys on the backend server as environment variables if possible. If you suspect your secret key has been compromised or want to reset it, you can do so from the dashboard.

To create API keys, go to the developer section of the Moneroo dashboard.


Moneroo.io Create API Keys
Do not commit your secret keys to git, or use them in client-side code.

As you build and test your integration, think about using Sandbox API keys for a secure environment. You'll find more about Sandbox mode in our detailed Moneroo API testing guide. When you're confident and ready to handle real payments, smoothly switch to Live API keys.

Remember, keeping all API keys secure is vital. Never share them. If by chance a key gets out, you can delete it immediately. Make sure to update your code with the new keys to keep everything running smoothly.

API key Authentication
Each API request should include the API key or token, sent within the Authorization header of the HTTP call using the Bearer method. For instance, a valid Authorization header looks like this: Bearer test_dHar4XY7LxsDOtmarVtjNVWXLSlXsM.

Typically, our SDKs offer shortcuts to simplify setting the API key or access token and interacting with the API.

In the example below, we utilize a test API key for the GET method of the payment resource, which retrieves a payment with the payment ID test_yyfbwekjnsd.


Copy
curl https://api.moneroo.io/v1/payments/test_yyfbwekjnsd
-H "Authorization: Bearer YOUR_SECRET_KEY"
-X GET
Do not set VERIFY_PEER to FALSE. Ensure your server verifies the SSL connection to Moneroo.

Rate Limiting
The Moneroo API enforces a rate limit of 120 requests per minute. If you surpass this threshold, subsequent requests will receive a 429 Too Many Requests response. In such cases, wait for 60 seconds before attempting to retry your request.

📃
Responses format
When interacting with the Moneroo APIs, it is essential to understand the format of the responses you will receive. This will help you properly interpret the responses and handle them appropriately in your application.

Response Structure
Responses from the Moneroo API are returned in the JSON format and follow a consistent structure. Here's an example of a typical response:


Copy
{
  "message": "Transaction initialized successfully.",
  "data": {},
  "errors" : null
}
Each part of this response carries specific information:

message

This is a string field that provides a human-readable message about the result of the operation. If the API call is a success, this message usually confirms what has been achieved. If the API call has failed, this message usually provides information about what went wrong.

data

This object contains any data returned by the operation. Its structure varies based on the specific API endpoint and the information it's designed to provide. For instance, a payment-related API might furnish payment details in this field. If no data is available, this field will be represented as an empty object ({}).

Please refer to the specific API endpoint documentation to understand the structure and content of the data field for each endpoint.

errors

When interacting with the Moneroo APIs, you may encounter an errors field in the response body, especially in cases where the operation fails to execute as expected. This field is an array of error objects, each providing detailed context about specific issues encountered during the operation. These objects contain information such as the type of error, a detailed error message, and sometimes, a hint or steps to resolve the issue. 

Understanding this response format is crucial to making the most of the Moneroo APIs, as it will allow you to handle both successful operations and errors in a robust and user-friendly way.


Introduction
⚠️
Errors
Moneroo API is RESTful and as such, uses conventional HTTP response codes to indicate the success or failure of requests. This section describes the summary of these codes and what they mean in our context.

Summary
Codes in the 2XX range mean that the API request was processed successfully.

Codes in the 4XX range mean that something was wrong with the data that you sent. For example, you might have missed some required parameters/headers, or you might be using the wrong API credentials.

Codes in the 5XX range indicate an error in processing on our end

Common HTTP Codes
Code
Description
200

OK - Request was successful

201

Created - The request was successful, and a resource was created as a result

202

Accepted - Request has been accepted and acknowledged. We will now go ahead to process the request and notify you of the status afterwards.

400

Bad Request - Malformed request or missing required parameters

401

Unauthorized - Missing required headers, wrong Public or Secret Key etc

403

Forbidden - You are trying to access a resource for which you don't have proper access rights.

404

Not Found - You are trying to access a resource that does not exist

422

Unprocessable Entity - You provided all the required parameters but they are not proper for the request

429

Too Many Requests - You have exceeded the number of requests allowed in a given time frame.

500

Internal Server Error - We had a glitch in our servers. Retry the request in a little while or contact support. Rarely happens.

503

Service Unavailable – We are temporarily offline for maintenance. Please try again later. Rarely happens.

During the development process of your integration, it is important to test it properly. As explained briefly in our authentication guide, you can access the Moneroo API sandbox mode using the sandbox API keys.

Testing the Moneroo API
Any payments or other resources you create in sandbox mode are completely isolated from your real data. To switch from sandbox mode to real mode, you just need to change your API key.

Sandbox transactions are automatically deleted after 90 days.

Test mode payment screen
When making a payment in sandbox mode, a red badge appears at the bottom of the page to signify that you're in sandbox mode. 

It looks like this:

🪝
Webhooks
Webhooks facilitate real-time communication of status updates, like successful payment notifications. They are URLs that Moneroo calls to transmit the ID of an updated object. 

Upon receiving the call, fetch the latest status and process it if there are any changes.

Introduction
Moneroo can dispatch webhooks to alert your application whenever an event occurs on your account. This is particularly useful for events such as failed or successful transactions. This mechanism is also beneficial for services not directly responsible for creating an API request but still requiring the response to that request. 

You can specify the webhook URLs where you want to be notified. When an event happens, Moneroo sends you an object with all the details about the event via an HTTP POST request to the defined endpoint URLs.


Moneroo.io Webhook
Types of events
Here are the current events we trigger. More will be added as we extend our actions in the future.

Payment events
Event Name
Description
payment.initiated

Triggered when a new payment process begins.

payment.success

Triggered when a payment process completes successfully.

payment.failed

Triggered when a payment process fails.

payment.cancelled

Triggered when a payment process is cancelled.

Payout events
Event Name
Description
payout.initiated

Triggered when a payout process begins.

payout.success

Triggered when a payout process completes successfully.

payout.failed

Triggered when a payout process fails.

You can use these event names in your application to instigate specific actions whenever Moneroo emits these events.

Structure of a webhook
All webhook payloads follow a consistent basic structure, including two main components:

Event: The type of event that has occurred.

Data: The data associated with the event. The contents of this object will vary depending on the event, but typically it will contain details of the event, including:

an id containing the ID of the transaction

a status, describing the status of the transaction payment, payout or customer details, if applicable

Example


Copy
{
  "event": "payment.success",
  "data": {
    "id": "123456",
    "amount": 100,
    "currency": "USD",
    "status": "success",
    "customer": {
      "id": "123456",
      "email": "hello@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1 555 555 5555"
    }
  }
}
We do not provide complete information through the webhook, so you'll need to fetch the latest status of the object.

Configuration
To configure webhooks, navigate to your app dashboard, access the Developers section, and click on the Webhooks tab. 


Webhook tab
There you can add a new webhook by clicking on the Add webhook button and filling in the form with the following details:

URL: The URL of the webhook.

Secret: The secret key used to sign the webhook payload.

The secret key is used to sign the webhook payload, enabling you to verify that the webhook originated from Moneroo.

You can add a maximum of 15 webhooks per application.

You can also enable, disable, or delete an existing webhook by clicking on the respective buttons.

The webhook is sent as a POST request to the URL you specify. The request body contains JSON, detailing the event that occurred. Ensure your endpoint can accept POST requests and parse JSON payloads.

Receiving a Webhook
When Moneroo sends a webhook to your URL, it includes a JSON payload detailing the event. For example, here's a payload for the payment.success event:


Copy
{
  "event": "payment.success",
  "data": {
    "id": "123456",
    "amount": 100,
    "currency": "USD",
    "status": "success"
  }
}
You can use the event field in the payload to determine the action your application should take.

To acknowledge the receipt of a webhook, your endpoint must return a 200 HTTP status code. Any other response codes, including 3xx codes, will be treated as a failure. We do not consider the response body or headers.

If your endpoint doesn't return a 200 HTTP status code or doesn't respond within 3 seconds, we'll retry the webhook up to 3 times with a 10-minute delay between each attempt.

Web frameworks like Rails, Laravel, or Django typically check that every POST request contains a CSRF token. While this is a useful security feature protecting against cross-site request forgery, you'll need to exempt the webhook endpoint from CSRF protection to ensure webhooks work (as demonstrated in the examples below).

Verifying a Webhook
When you receive a webhook, you should verify its origin. Each webhook request includes a X-Moneroo-Signature header. The value of this header is a signature generated using your webhook signing secret and the webhook's payload.

To verify the signature, you'll need to compute the signature on your end and compare it to the X-Moneroo-Signature header's value.

The signature is computed using HMAC-SHA256 with the webhook signing secret as the key and the payload as the value.

If the signature is valid, respond with a 200 OK status code. If it's not valid, respond with 403 Forbidden.

Examples
Please replace 'your_webhook_signing_secret', 'your_payload' and 'header_value' with your actual values. For the Node.js, Java, and Go examples, you need to get the request body and header values from your HTTP request object.

PHP
JavaScript (Node.js)
Java
Python
Go

Copy
<?php
$secret = 'your_webhook_signing_secret';
$payload = file_get_contents('php://input');
$signature = hash_hmac('sha256', $payload, $secret);

if (hash_equals($signature, $_SERVER['HTTP_X_MONEROO_SIGNATURE'])) {
    http_response_code(200);
} else {
    http_response_code(403);
}
?>
Webhook Best Practices
Don't Rely Solely on Webhooks: Make sure you have a backup strategy like a background job that checks for the status of any pending transactions at regular intervals. This can be useful in case your webhook endpoint fails or you haven't received a webhook in the following seconds.

Use a Secret Hash: Your webhook URL is public, anyone can send a fake payload. We recommend using a secret hash to authenticate requests.

Always Re-query: Verify received details with our API to ensure data integrity. For example, upon receiving a successful payment notification, use our transaction verification endpoint to verify the transaction status.

Respond Quickly: Your webhook endpoint must respond within a certain time limit to avoid failure and retries. Avoid executing long-running tasks in your webhook endpoint to prevent timeouts. Respond immediately with a 200 status code if successful, and then perform any long-running tasks asynchronously.

Handle Duplicates: Webhooks may be delivered more than once in some cases. For example, if we don't receive a response from your endpoint, we'll retry the webhook. Make sure your endpoint can handle duplicate webhook notifications.

Handle Failures: If your endpoint fails, we'll retry the webhook up to 3 times with a 10-minute delay between each attempt. If all attempts fail, we'll stop retrying and mark the webhook as failed. You can view failed webhooks in your dashboard.

When you collect payments with Moneroo, you have many options. Here's a quick overview:

If you're building a website or application

Moneroo Standard : This is the basic, "standard" integration approach. To use this, you need to call our API from your server to generate a payment link. You then redirect your customer to this link for them to make the payment. Once the payment has been processed, we'll redirect them back to you.

Another options and integration will be available soon.


🔁
Standard Integration
Overview
Moneroo Standard is our "standard" payments flow that redirects your customer to a Moneroo-hosted payments page.

Here's how it works:

From your server, call the payment initialization endpoint with the payment details.

We'll return a link to a payment page. Redirect your customer to this link to make the payment.

Upon completion of the transaction, we'll redirect the customer back to you (to the return_url you provided) with the payment details.

Step 1: Collect payment details
First, you need to assemble payment details that will be sent to your API as a JSON object.

Here fields you need to collect:

Field Name
Type
Required
Description
amount

integer

Yes

The payment amount.

currency

string

Yes

The currency of the payment.

description

string

Yes

Description of the payment.

return_url

string

Yes

Return URL where your customer will be redirected after payment.

customer.email

string

Yes

Customer's email address.

customer.first_name

string

Yes

Customer's first name.

customer.last_name

string

Yes

Customer's last name.

customer.phone

string

No¹

Customer's phone number.

customer.address

string

No¹

Customer's address.

customer.city

string

No¹

Customer's city.

customer.state

string

No¹

Customer's state.

customer.country

string

No¹

Customer's country.

customer.zip

string

No¹

Customer's zip code.

metadata

array

No²

Additional data for the payment.

methods

array

No³

Payment method you want to make available for this transaction.

restrict_country_code

string

No⁴

Restrict the payment to a specific country.

restricted_phone

object

No⁴

Restrict the payment to a specific phone number.

restricted_phone.number

string

Yes⁵

The phone number to restrict the payment to.

restricted_phone.country_code

string

Yes⁵

The country code of the restricted phone number.

If not provided, the customer can be prompted to enter these details during the payment process based on the selected payment method.

There should be an array of key-value pairs. Only string values are allowed.

If not provided, all available payment methods will be allowed. The array should contain only the supported payment method's shortcodes.

You can use either restrict_country_code or restricted_phone, but not both. They are mutually exclusive.

Required if restricted_phone is provided.

Step 2: Obtain a Payment Link
Next, initiate the payment by calling the API with the collected payment details using the secret key for authorization.

Example request :

Copy
POST /v1/payments/initialize
Host: https://api.moneroo.io
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
Accept: application/json
{
    "amount": 100,
    "currency": "USD",
    "description": "Payment for order #123",
    "customer": {
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "return_url": "https://example.com/payments/thank-you"
    "metadata": {
        "order_id": "123",
        "customer_id": "123" 
    },
    "methods": ["mtn_bj", "moov_bj"] # Once again, it is not required
}
Example response :

Copy
{
  "message": "Transaction initialized successfully",
  "data": {
    "id": "5f7b1b2c",
    "checkout_url": "https://checkout.moneroo.io/5f7b1b2c"
  }
}
Step 3: Redirect the User to the Payment Link
You only need to redirect your customer to the link returned in data.checkout_url. We will display our payment interface for the customer to make the payment.

Step 4: After Payment
Once the payment is made, whether successful or failed, four things will occur:

We redirect your user to your return_url with the status, paymentId, and paymentStatus in the query parameters once the payment is completed.

We will send you a webhook if you have activated it. For more information on webhooks and to see examples, check out our webhooks guide.

If the payment is successful, we will send an acknowledgment email to your customer (unless you have disabled this feature).

We will email you (unless you have disabled this feature).

On the server side, you need to handle the redirection and always check the final status of the transaction. 

If you have webhooks enabled, we'll send you a notification for each failed payment attempt. This is useful in case you want to later reach out to customers who had issues paying. See our webhooks guide for an example.

Example
Do not forget to replace YOUR_SECRET_KEY with your actual secret key.

All subsequent examples should be executed in the backend. Never expose your secret key to the public.

cURL
PHP
Python
Go
JavaScript (Node.js)

Copy
const axios = require('axios');

const data = {
    "amount": 100,
    "currency": "USD",
    "description": "Payment for order #123",
    "customer": {
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },
    "return_url": "https://example.com/payments/thank-you",
    "metadata": {
        "order_id": "123",
        "customer_id": "123",
    },
    "methods": ["qr_ngn", "bank_transfer_ngn"]
};

const options = {
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_SECRET_KEY'
    'Accept': 'application/json'
  }
};

axios.post('https://api.moneroo.io/v1/payments/initialize', data, options)
    .then((response) => {
        if (response.status !== 201) {
            throw new Error(`Request failed with status ${response.status}`);


 }
        console.log(`Redirect to: ${response.data.checkout_url}`);
    })
    .catch((error) => {
        console.error(error);
    });


    Payments
😎
Transaction verification
After initiating a payment, you should confirm that the transaction was processed through Monero before crediting/debiting your customer in your application. This step ensures that the payment aligns with your expectations. 

Here are some key points to verify during the payment confirmation:

Confirm the Transaction Reference: Ensure that the transaction reference matches the one you generated.

Check the Transaction Status: Verify the transaction status is marked as success for successful payments. For more information on transaction statuses, refer to the Transaction Status Section.

Verify the Currency: Confirm that the payment's currency matches the expected currency.

Ensure Correct Payment Amount: Check that the paid amount is equal to or greater than the anticipated amount. If the amount is higher, provide the customer with the corresponding value and refund the surplus.

To authenticate a payment, use the verify transaction endpoint. Specify the transaction ID in the URL. You can obtain the transaction ID from the data.id field in the response after creating a transaction, as well as from the webhook payload for any transaction.

Request

Copy
GET /v1/payments/{paymentId}/verify HTTP/1.1
Host: https://api.moneroo.io
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
Accept: application/json
Parameters
Endpoint: /v1/payments/{paymentId}/verify

Method: GET

Name
Type
Required
Description
paymentId

String

Yes

The unique ID of the payment transaction to verify.

Response Structure
The response from this API endpoint will be in the standard Moneroo API response format. You'll get a response that looks like this:


Copy
{
  "message": "Payment transaction fetched successfully",
  "data": {
    // Details of the payment transaction
  }
}
Successful Response:

Upon successful retrieval, the endpoint returns a HTTP status code of 200, and the details of the payment transaction in the response body.

Error Responses:

If there's an issue with your request, the API will return an error response. The type of error response depends on the nature of the issue. Check out our response format page for more information.

Security considerations
This endpoint requires a bearer token for authentication. The bearer token must be included in the Authorization header of the request. Ensure the token is kept secure and not shared or exposed inappropriately.

Request examples
Please replace 'paymentId' with the actual payment transaction ID and 'your_token' with your valid authorization token in the code snippets above.

Curl
PHP
Python
Go
JavaScript (Node.js)

Copy
const axios = require("axios");

const paymentId = "your_payment_id";
const token = "your_token";

axios
  .get(`https://api.moneroo.io/v1/payments/${paymentId}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      // Handle successful response
    } else {
      // Handle error response
    }
  })
  .catch((error) => {
    // Handle error
  });
Response example
You'll get a response that looks like this:


Copy
{
    "message": "Payment transaction fetched successfully!",
    "data": {
        "id": "k4su1ii7abdz",
        "status": "success",
        "is_processed": false,
        "processed_at": null,
        "amount": 200,
        "amount_formatted": "XOF 200",
        "currency": {
            "name": "CFA Franc BCEAO",
            "symbol": "XOF",
            "symbol_first": false,
            "decimals": 0,
            "decimal_mark": ",",
            "thousands_separator": ".",
            "subunit": "Centime",
            "subunit_to_unit": 100,
            "symbol_native": "XOF",
            "decimal_digits": 0,
            "rounding": 0,
            "code": "XOF",
            "name_plural": "CFA francs BCEAO",
            "icon_url": "https://assets.cdn.moneroo.io/currencies/XOF.svg"
        },
        "description": "Payment for order #124",
        "return_url": "https://axaship.com?paymentId=k4su1ii7abdz&paymentStatus=success",
        "environment": "sandbox",
        "initiated_at": "2024-01-31T14:46:13.000000Z",
        "metadata": {
            "order_id": "124",
            "customer_id": "124"
        },
        "app": {
            "id": "01HHJYSA4VCBVK135N4KTYF76J",
            "name": "Smarthome",
            "website_url": "https://www.smarthome.com",
            "icon_url": "https://assets.cdn.moneroo.io/samples/business.svg",
            "created_at": "2023-12-14T01:24:17.000000Z",
            "updated_at": "2023-12-14T01:24:17.000000Z",
            "is_enabled": false
        },
        "customer": {
            "id": "tzowl42roc7z",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@example.com",
            "phone": null,
            "address": null,
            "city": null,
            "state": null,
            "country_code": null,
            "country": null,
            "zip_code": null,
            "profile_url": "https://eu.ui-avatars.com/api/?name=John+Doe&background=5F6368&color=fff&size=256&rounded=true&bold=true",
            "created_at": "2023-12-14T01:49:28.000000Z",
            "updated_at": "2023-12-14T01:49:28.000000Z"
        },
        "capture": {
            "identifier": "14189ccd-4c52-4f29-bbd2-75ab45fc8c80",
            "rate": null,
            "rate_formatted": null,
            "correction_rate": null,
            "phone_number": "22951345780",
            "failure_message": null,
            "failure_error_code": null,
            "failure_error_type": null,
            "metadata": {
                "network_transaction_id": null,
                "amount_debited": null,
                "commission": null,
                "fees": null,
                "selected_payment_method": null
            },
            "amount": 200,
            "amount_formatted": "XOF 200",
            "currency": {
                "name": "CFA Franc BCEAO",
                "symbol": "XOF",
                "symbol_first": false,
                "decimals": 0,
                "decimal_mark": ",",
                "thousands_separator": ".",
                "subunit": "Centime",
                "subunit_to_unit": 100,
                "symbol_native": "XOF",
                "decimal_digits": 0,
                "rounding": 0,
                "code": "XOF",
                "name_plural": "CFA francs BCEAO",
                "icon_url": "https://assets.cdn.moneroo.io/currencies/XOF.svg"
            },
            "method": {
                "id": "kt1itmi9xv0g",
                "name": "MTN MoMo Benin",
                "short_code": "mtn_bj",
                "icon_url": "https://assets.cdn.moneroo.io/icons/circle/mtn_xof.svg"
            },
            "gateway": {
                "id": "6eip4udyt8o6",
                "account_name": "Acme Inc",
                "name": "PawaPay (Sandbox)",
                "short_code": "pawapay_sandbox",
                "icon_url": "https://assets.cdn.moneroo.io/icons/circle/pawapay.svg",
                "transaction_id": "14189ccd-4c52-4f29-bbd2",
                "transaction_status": "COMPLETED",
                "transaction_failure_message": null
            },
            "context": {
                "ip": "2a09:bac5:52d:c8",
                "user_agent": {
                    "is_desktop": true,
                    "is_robot": false,
                    "platform": "OS X",
                    "browser": "Chrome",
                    "version": "120.0.0.0",
                    "device": "Macintosh",
                    "is_mobile": false,
                    "is_phone": false,
                    "is_tablet": false,
                    "is_ios": false,
                    "is_android": false
                },
                "country": {
                    "name": "Benin",
                    "code": "BJ",
                    "alpha_3_code": "BEN",
                    "dial_code": "+229",
                    "currency": "XOF",
                    "currency_symbol": "CFA",
                    "flag": "https://cdn.axazara.com/flags/svg/BJ.svg"
                },
                "local": "en"
            }
        },
        "created_at": "2024-01-31T14:46:13.000000Z"
    },
    "errors": null
}
The transaction details are contained in the data object. For instance:

id: A unique identifier for the payment transaction.

status: The current status of the transaction (success, pending, failed).

is_processed: A boolean value indicating whether the transaction has been mark as processed.

processed_at: A timestamp of when the transaction was processed. null if not processed yet.

amount: The total amount of the transaction.

currency: An object containing details of the currency used for the transaction.

amount_formatted: A string representing the formatted amount of the transaction.

description: A brief description of the payment transaction.

return_url: The URL where the user will be redirected post-transaction.

environment: Indicates the environment where the transaction was processed (sandbox or live).

capture : An object detailing specifics details about payment transaction ( method, gateway, context )

initiated_at: The timestamp when the transaction was initiated.

metadata: An object that stores additional information passed along with the transaction.

app: An object containing information about the application through which the transaction was made.

Transaction object

Field Name
Description
id

The public ID of the transaction.

status

The status of the transaction.

is_processed

Indicates whether the transaction is processed.

processed_at

The time when the transaction was processed.

amount

The amount involved in the transaction.

currency

The currency used in the transaction.

amount_formatted

The formatted amount involved in the transaction.

description

The description of the transaction.

return_url

The URL to return to after the transaction.

environment

The environment in which the transaction occurred.

initiated_at

The time when the transaction was initiated.

checkout_url

The URL to checkout the transaction.

payment_phone_number

The phone number associated with the payment method.

app

The app associated with the transaction.

customer

The customer associated with the transaction.

method

The payment method associated with the transaction.

gateway

The payment gateway associated with the transaction.

metadata

The metadata associated with the transaction.

context

The context associated with the transaction.

capture Object:

Field Name
Description
identifier

A unique identifier for the payment capture.

rate

The exchange rate applied to the transaction, if any. Null if not applied. 

rate_formatted

The formatted string of the applied exchange rate. Null if not applied.

correction_rate

Any correction to the initial rate that was applied. Null if not applied.

phone_number

The phone number associated with the payment method.

failure_message

A message detailing any failure that occurred during capture. Null if none.

failure_error_code

The error code associated with the failure, if any. Null if no error.

failure_error_type

The type of error encountered during capture, if any. Null if no error.

metadata

Additional metadata related to the capture process.

amount

The amount that was captured.

amount_formatted

The formatted amount that was captured according to the currency rules.

currency

A nested object detailing the currency used in the capture.

method

A nested object describing the payment method used for capture.

gateway

A nested object with details about the payment gateway used.

context

A nested object containing contextual details about the transaction.


🔎
Retrieve payment
The Moneroo platform's API offers an endpoint that allows you to fetch the detailed information of a specific payment transaction based on its unique transaction ID.

This guide will walk you through the process of retrieving a payment transaction using Moneroo's API.

Request

Copy
GET /v1/payments/{paymentId} HTTP/1.1
Host: https://api.moneroo.io
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
Accept: application/json
Parameters
Endpoint: /v1/payments/{paymentId}

Method: GET

Name
Type
Required
Description
paymentId

String

Yes

The unique ID of the payment transaction to retrieve.

Response Structure
The response from this API endpoint will be in the standard Moneroo API response format.

You'll get a response that looks like this:


Copy
{
  "success": true,
  "message": "Payment transaction fetched successfully",
  "data": {
    // Details of the payment transaction
  }
}
Successful Response:

Upon successful retrieval, the endpoint returns a HTTP status code 200, and the payment transaction details in the response body.

Error Responses:

If there's an issue with your request, the API will return an error response. The type of error response depends on the nature of the issue. Check out the response format page for more information.

Security considerations
This endpoint requires a bearer token for authentication. The bearer token must be included in the Authorization header of the request. Ensure the token is kept secure and not shared or exposed inappropriately.

Request examples
Please replace 'paymentId' with the actual payment transaction ID and 'your_token' with your valid authorization token in the code snippets above.

Curl
PHP
Python
Go
JavaScript (Node.js)

Copy
const axios = require("axios");

const paymentId = "your_payment_public_id";
const token = "your_token";

axios
  .get(`https://api.moneroo.io/v1/payments/${paymentId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      const data = response.data;
      // Handle successful response and retrieve the payment transaction details
    } else {
      // Handle error response
    }
  })
  .catch((error) => {
    // Handle error
  });
Response example
You'll get a response that looks like this:


Copy
{
  "success": true,
  "message": "Payment transaction fetched successfully",
  "data": {
    "id": "abc123",
    "status": "success",
    "is_processed": true,
    "processed_at": "2023-05-21T12:00:00Z",
    "amount": 100.0,
    "currency": "USD",
    "amount_formatted": "$100.00",
    "description": "Purchase of goods",
    "return_url": "https://example.com/return",
    "environment": "production",
    "initiated_at": "2023-05-21T11:00:00Z",
    "checkout_url": "https://example.com/checkout",
    "payment_phone_number": "+1234567890",
    "app": {
      "id": "app1",
      "name": "Example App",
      "icon_url": "https://example.com/icon.png"
    },
    "customer": {
      "id": "cust1",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "country_code": "US",
      "country": "United States",
      "zip_code": "62701",
      "environment": "production",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-05-21T00:00:00Z"
    },
    "method": {
      "name": "Credit Card",
      "code": "cc",
      "icon_url": "https://example.com/cc.png",
      "environment": "production"
    },
    "gateway": {
      "name": "Stripe",
      "account_name": "Acme Corp",
      "code": "stripe",
      "icon_url": "https://example.com/stripe.png",
      "environment": "production"
    },
    "metadata": {
      "custom_field1": "custom_value1",
      "custom_field2": "custom_value2"
    },
    "context": {
      "ip": "192.0.2.0",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
      "country": "US",
      "local": "en-US"
    }
  }
}
The data field will contain the transaction details. The specific structure and content of this field depend on the details of the individual transaction.


✋
Status
When initiating payments, monitoring the transaction statuses allows you to track their progress effectively. This section will help you understand the meaning of each transaction status at Moneroo.

Each payment stage processed through our platform is marked with a specific transaction status. These statuses are categorized into two groups: transitional and final.

Simple View of Payment Transaction Statuses

Moneroo payment transaction state
To provide a clear overview of the payment transaction statuses, refer to the table below:

Status
State
Description
initiated

Transactional

Transaction has been initiated and is awaiting customer to complete the payment on checkout page.

pending

Transactional

Customer started the payment process, but it is not completed yet.

cancelled

Final

Transaction has been cancelled. This is a final status.

failed

Final

Transaction has failed. This is a final status.

success

Final

Transaction has been successfully completed. This is a final status.

🌍
Available methods
Below is a list of payment methods we support. The list is constantly growing, so check back for updates.

To learn more about a specific payment method and what payment gateway supports it, please check your connection list section.

You can get updated list of all available payment methods by calling GET /utils/payment/methods endpoint.


Copy
GET /utils/payout/methods HTTP/1.1
Host: https://api.moneroo.io
Accept: application/json
Name
Code
Currency
Countries
Airtel Congo

airtel_cd

CDF

CD

Airtel Money Malawi

airtel_mw

MWK

MW

Airtel Niger

airtel_ne

XOF

NE

Airtel Money Nigeria

airtel_ng

NGN

NG

Airtel Rwanda

airtel_rw

RWF

RW

Airtel Tanzania

airtel_tz

TZS

TZ

Airtel Uganda

airtel_ug

UGX

UG

Airtel Zambia

airtel_zm

ZMW

ZM

Bank Transfer NG

bank_transfer_ng

NGN

NG

Barter

barter

NGN

NG

Credit Card GHS

card_ghs

GHS

GH

Card Kenya

card_kes

KES

KE

Credit Card NGN

card_ngn

NGN

NG

Card Tanzania

card_tzs

TZS

TZ

Card Uganda

card_ugx

UGX

UG

Credit Card USD

card_usd

USD

World

Credit Card XAF

card_xaf

XAF

CM, CF, CG, GA, GQ, TD

Credit Card XOF

card_xof

XOF

CI, BF, TG, BJ, ML

Credit Card ZAR

card_zar

ZAR

ZA

Crypto EUR

crypto_eur

EUR

AT, BE, BG, CY, CZ, DE, DK, EE, ES, FI, FR, GR, HR, HU, IE, IT, LT, LU, LV, MT, NL, PL, PT, RO, SE, SI, SK

Crypto GHS

crypto_ghs

GHS

GH

Crypto NGN

crypto_ngn

NGN

NG

Crypto USD

crypto_usd

USD

US

Crypto XAF

crypto_xaf

XAF

CM, CF, CG, GA, GQ, TD

Crypto XOF

crypto_xof

XOF

BJ, BF, CI, GW, ML, NE, SN, TG

E-Money Senegal

e_money_sn

XOF

SN

EU Mobile Money Cameroon

eu_mobile_cm

XAF

CM

Free Money Senegal

freemoney_sn

XOF

SN

Halopesa

halopesa_tz

TZS

TZ

Mobi Cash Mali

mobi_cash_ml

XOF

ML

Test Payment Method

moneroo_payment_demo

USD

US

Moov Burkina Faso

moov_bf

XOF

BF

Moov Money Benin

moov_bj

XOF

BJ

Moov Money CI

moov_ci

XOF

CI

Moov Money Mali

moov_ml

XOF

ML

Moov Money Togo

moov_tg

XOF

TG

M-Pesa Kenya

mpesa_ke

KES

KE

Vodacom Tanzania

mpesa_tz

TZS

TZ

MTN MoMo Benin

mtn_bj

XOF

BJ

MTN MoMo CI

mtn_ci

XOF

CI

MTN MoMo Cameroon

mtn_cm

XAF

CM

MTN MoMo Ghana

mtn_gh

GHS

GH

MTN MoMo Guinea

mtn_gn

GNF

GN

MTN Nigeria

mtn_ng

NGN

NG

MTN MoMo Rwanda

mtn_rw

RWF

RW

MTN MoMo Uganda

mtn_ug

UGX

UG

MTN MoMo Zambia

mtn_zm

ZMW

ZM

Orange Burkina Faso

orange_bf

XOF

BF

Orange Congo

orange_cd

CDF

CD

Orange Money CI

orange_ci

XOF

CI

Orange Money Cameroon

orange_cm

XAF

CM

Orange Money Guinea

orange_gn

GNF

GN

Orange Money Mali

orange_ml

XOF

ML

Orange Money Senegal

orange_sn

XOF

SN

QR Code Nigeria

qr_ngn

NGN

NG

Airtel/Tigo Ghana

tigo_gh

GHS

GH

Tigo Tanzania

tigo_tz

TZS

TZ

TNM Mpamba Malawi

tnm_mw

MWK

MW

Togocel Money

togocel

XOF

TG

USSD NGN

ussd_ngn

NGN

NG

Vodacom Congo

vodacom_cd

CDF

CD

Vodafone Ghana

vodafone_gh

GHS

GH

Wave CI

wave_ci

XOF

CI

Wave Senegal

wave_sn

XOF

SN

Wizall Senegal

wizall_sn

XOF

SN

Zamtel Kwacha

zamtel_zm

ZMW

ZM

Mobi Cash Mali

mobi_cash_ml

XOF

ML

Test Payment Method

moneroo_payment_demo

USD

US

Moov Burkina Faso

moov_bf

XOF

BF

Moov Money Benin

moov_bj

XOF

BJ

Moov Money CI

moov_ci

XOF

CI

Moov Money Mali

moov_ml

XOF

ML

Moov Money Togo

moov_tg

XOF

TG

M-Pesa Kenya

mpesa_ke

KES

KE

Vodacom Tanzania

mpesa_tz

TZS

TZ

MTN MoMo Benin

mtn_bj

XOF

BJ

MTN MoMo CI

mtn_ci

XOF

CI

MTN MoMo Cameroon

mtn_cm

XAF

CM

MTN MoMo Ghana

mtn_gh

GHS

GH

MTN MoMo Guinea

mtn_gn

GNF

GN

MTN Nigeria

mtn_ng

NGN

NG

MTN MoMo Rwanda

mtn_rw

RWF

RW

MTN MoMo Uganda

mtn_ug

UGX

UG

MTN MoMo Zambia

mtn_zm

ZMW

ZM

Orange Burkina Faso

orange_bf

XOF

BF

Orange Congo

orange_cd

CDF

CD

Orange Money CI

orange_ci

XOF

CI

Orange Money Cameroon

orange_cm

XAF

CM

Orange Money Guinea

orange_gn

GNF

GN

Orange Money Mali

orange_ml

XOF

ML

Orange Money Senegal

orange_sn

XOF

SN

QR Code Nigeria

qr_ngn

NGN

NG

Airtel/Tigo Ghana

tigo_gh

GHS

GH

Tigo Tanzania

tigo_tz

TZS

TZ

TNM Mpamba Malawi

tnm_mw

MWK

MW

Togocel Money

togocel

XOF

TG

USSD NGN

ussd_ngn

NGN

NG

Vodacom Congo

vodacom_cd

CDF

CD

Vodafone Ghana

vodafone_gh

GHS

GH

Wave CI

wave_ci

XOF

CI

Wave Senegal

wave_sn

XOF

SN

Wizall Senegal

wizall_sn

XOF

SN

Zamtel Kwacha

zamtel_zm

ZMW

ZM

We are constantly adding new payment methods. If you don't see your preferred payment method, please contact us.


🧙
Testing
Testing your integration is a crucial step in ensuring a seamless payment experience with Moneroo. Moneroo offers a dedicated sandbox environment for testing purposes, allowing you to validate your integration before going live. In the sandbox mode, you can simulate real transactions without processing actual payments.

Using the Sandbox Environment
To conduct tests in the sandbox environment, you will use specific keys known as "sandbox keys" or "test keys." These keys differ from the production keys and are intended solely for testing purposes. They provide a secure and controlled setting to experiment with and validate your integration.

Benefits of Using the Sandbox
By using the sandbox keys and the Moneroo sandbox environment, you can:

Thoroughly test your integration

Ensure compatibility with Moneroo systems

Address any potential issues before deployment to the live production environment.

Sandbox data is automatically deleted after 90 days. This only affects transactions and customers.

Default Payment Processor: Moneroo Test Payment Gateway
By default, your Moneroo app includes the "Moneroo Test Payment Gateway" as the default payment gateway in the sandbox environment. This gateway allows you to simulate various transaction scenarios, providing insights into how your system responds in each case.

Simulating Transaction Scenarios
To thoroughly test your integration, Moneroo provides specific test phone numbers. These numbers enable you to simulate both successful and failed transactions, allowing you to assess how your system manages each scenario. During your testing, use these test phone numbers to mimic real transaction behaviors and observe how your integration responds.

Key Features of Test Payment Gateway
Flexibility in Testing: Simulate a wide range of transaction scenarios to ensure your application is robust and reliable.

Realistic Response Simulation: Observe detailed responses from your system as it would handle actual transactions, helping you to fine-tune your integration before going live.

Using these tools, you can ensure that your integration is fully prepared for production deployment, minimizing potential issues for real users.

The test phone numbers are only available for the Moneroo Test Payment Gateway and cannot be used with other payment gateways in the sandbox mode.

These numbers can be used to simulate their respective scenarios for all payment methods associated with the Moneroo Test Payment Gateway.

Phone Number
Scenario
Currency
Country
(414)951-8161

✅ Successful transaction

USD

US

(414)951-8162

⌛Pending transaction

USD

US

(414)951-8163

❌Failed transaction

USD

US

Testing with Other Payment Gateways in Sandbox Mode
Moneroo offers the ability to integrate with other payment gateways in the sandbox mode.

For each payment gateway available in the sandbox mode, you should consult the specific payment gateway's documentation for their test instructions. These instructions will provide you with the necessary information on how to integrate with the payment gateway, use the test keys or credentials, and simulate different transaction scenarios specific to that payment gateway.

Moneroo is continuously working on expanding the availability of supported payment gateways in the sandbox mode. Therefore, be sure to stay updated with the latest announcements and updates from Moneroo regarding new integrations and sandbox testing options. Here is a link to each payment gateway supported in the sandbox mode test instructions to their documentation:

💸
Initialize payout
Moneroo's Payout API lets you send money to your customers. You can use it for refunds, rebates, salary payments, and more.

How It Works

Send a POST Request

From your server, send a POST request to Moneroo's Payout API with the payment details.

Processing the Request

Moneroo processes the request through the appropriate payment processor based on your chosen payout method.

Receive the Response

Moneroo will return a response with the status of your request.

Step 1: Collect payout details
First, gather the payment details and format them as a JSON object to send to our API.

Here are the fields that you need to gather:

Field Name
Type
Required
Description
amount

integer

Yes

The payout amount.

currency

string

Yes

The currency of the payment. Currency should be a supported currency in valid ISO 4217 format.

description

string

Yes

Description of the payment.

method

string

Yes

Payout method. Should be a valid supported payout method. Please check the supported payout method list

customer

object

Yes

Customer details.

customer.email

string

Yes

Customer's email address.

customer.first_name

string

Yes

Customer's first name.

customer.last_name

string

Yes

Customer's last name.

customer.phone

integer

No

Customer's phone number.

customer.address

string

No

Customer's address.

customer.city

string

No

Customer's city.

customer.state

string

No

Customer's state.

customer.country

string

No

Customer's country. Should be Should be a code in valid ISO 3166-1 alpha-2 format.

customer.zip

string

No

Customer's zip code.

metadata

array

No

Additional data for the payment.

Step 2: Add required fields for specific payout methods
Each payout method has its required fields. Please check the supported payout method list to see the required fields for each payout method.  These  required fields should be provided via recipient fields
For example, the mtn_bj (MTN Mobile Money Benin) method requires you to provide msisdn via the following object:


Copy
"recipient" : {
    "msisdn" : "22951345020" //the MTN Mobile Money Phone number of customer
} 
Step 3: Send the payout request
Next, initiate the payout by calling our API with the collected payout details (don't forget to authorize with your secret key).

Example request :

Copy
POST /v1/payouts/initialize
Host: https://api.moneroo.io
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
Accept: application/json
{
    "amount": 1000,
    "currency": "XOF",
    "description": "Order refund",
    "customer": {
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },

    "metadata": {
        "payout_request": "123",
        "customer_id": "123"
    },
    "method": "mtn_bj",
    "recipient" : {
        "msisdn" : "22951345020"
    } 
}
Example response :

Copy
{
  "success": true,
  "message": "Payout transaction initialized successfully",
  "data": {
    "id": "5f7b1b2c-1b2c-5f7b-0000-000000000000"
  }
}
Step 3: After the payout request is sent
Once the payout is made (successful or failed), four things will occur:

Webhook Notification: If you have activated webhooks, we will send you a notification. For more information and examples, check out our guide on webhooks.

Email Notification: We will email you unless you have disabled this feature.

Server-Side Verification: You can verify the transaction on the server side by calling our API with the transaction ID.

Failed Payout Notification: If webhooks are enabled, we'll notify you for each failed payout. This can help you reach out to customers or take other actions. See our webhooks guide for an example.

If you have the webhooks setting enabled on your Moneroo application, we'll send you a notification for each failed payout. This is useful in case you want to later reach out to customers or perform other actions. See our webhooks guide for an example.

Example
Please do not forget to replace YOUR_SECRET_KEY with your actual secret key.

All following examples should be made in the backend, never expose your secret key to the public.

cURL

Copy
curl -X POST https://api.moneroo.io/v1/payouts/initialize \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer YOUR_SECRET_KEY" \
     -H "Accept: application/json" \
     -d '{
    "amount": 1000,
    "currency": "XOF",
    "description": "Order refund",
    "customer": {
        "email": "john@example.com",
        "first_name": "John",
        "last_name": "Doe"
    },

    "metadata": {
        "payout_request": "123",
        "customer_id": "123"
    },
    "method": "mtn_bj",
    "recipient" : {
        "msisdn" : "22951345020"
    } 
}'

😎
Verify payout
After a payout, it's crucial to confirm that the transaction was processed through Moneroo before crediting value to your customer wallet or balance in your application. This precaution ensures the payment received aligns with your expectations.

Here are some key points to verify during the payment confirmation:

Transaction Reference: Confirm that the transaction reference corresponds with the one you generated.

Transaction Status: Check the transaction status for accuracy. The status should be "success" for successful payments. To learn more about transaction statuses, see the transaction status section.

Payment Currency: Verify that the payment's currency matches the expected currency.

Paid Amount: Ensure the paid amount is equal to or greater than the anticipated amount. If the amount is higher, you can provide the customer with the corresponding value and refund the surplus.

To authenticate a payment, use the "verify transaction" endpoint, specifying the transaction ID in the URL. You can obtain the transaction ID from the data.id field in the response after transaction creation, as well as in the webhook payload for any transaction.

Request

Copy
GET /v1/payouts/{payoutId}/verify HTTP/1.1
Host: https://api.moneroo.io
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
Accept: application/json
Parameters
Endpoint: /v1/payouts/{payoutId}/verify

Method: GET

Name
Type
Required
Description
payoutId

String

Yes

The unique ID of the payout transaction to verify.

Response Structure
The response from this API endpoint will be in the standard Moneroo API response format. You'll get a response that looks like this:


Copy
{
  "message": "Payout transaction fetched successfully",
  "data": {
    // Details of the payout transaction
  }
}
Successful Response:

Upon successful retrieval, the endpoint returns an HTTP status code of 200 and the details of the payment transaction in the response body.

Error Responses:

401 Unauthorized: This error is returned if you didn't provide a valid authorization token in your request.

404 Not Found: This error is returned if the provided payoutId doesn't correspond to any transaction in the system.

500 Internal Server Error: This error indicates an unexpected issue on the server while processing your request. It happens rarely.

Security considerations
This endpoint requires a bearer token for authentication. The bearer token must be included in the Authorization header of the request. Ensure the token is kept secure and not shared or exposed inappropriately.

Request examples
Replace 'paymentId' with the actual payment transaction ID and 'your_token' with a valid API key in the code snippets above.

Curl
PHP
Python
Go
JavaScript (Node.js)

Copy
const axios = require("axios");

const paymentId = "your_payment_id";
const token = "your_token";

axios
  .get(`https://api.moneroo.io/v1/payments/${paymentId}/verify`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      // Handle successful response
    } else {
      // Handle error response
    }
  })
  .catch((error) => {
    // Handle error
  });
You'll get a response that looks like this:


Copy
{
    "message": "Payout transaction fetched successfully!",
    "data": {
        "id": "go86j8csuq51",
        "status": "success",
        "amount": 500,
        "currency": {
            "name": "US Dollar",
            "symbol": "$",
            "symbol_first": true,
            "decimals": 2,
            "decimal_mark": ".",
            "thousands_separator": ",",
            "subunit": "Cent",
            "subunit_to_unit": 100,
            "symbol_native": "$",
            "decimal_digits": 2,
            "rounding": 0,
            "code": "USD",
            "name_plural": "US dollars",
            "icon_url": "https://assets.cdn.moneroo.io/currencies/USD.svg"
        },
        "amount_formatted": "$ 500.00",
        "description": "hello",
        "environment": "sandbox",
        "metadata": [],
        "app": {
            "id": "01HHJYSA4VCBVKN4KTYF76J",
            "name": "Smarte",
            "website_url": "https://www.smarthome.com",
            "icon_url": "https://assets.cdn.moneroo.io/samples/business.svg",
            "created_at": "2023-12-14T01:24:17.000000Z",
            "updated_at": "2023-12-14T01:24:17.000000Z",
            "is_enabled": false
        },
        "customer": {
            "id": "fsbh12wot2c3",
            "first_name": "John",
            "last_name": "Doe",
            "email": "john@test.com",
            "phone": null,
            "address": null,
            "city": null,
            "state": null,
            "country_code": null,
            "country": null,
            "zip_code": null,
            "profile_url": "https://eu.ui-avatars.com/api/?name=John+Dow&background=ffcc00&color=fff&size=256&rounded=true&bold=true",
            "created_at": "2023-12-22T01:00:37.000000Z",
            "updated_at": "2024-01-08T13:09:23.000000Z"
        },
        "disburse": {
            "id": "0nj13p3bheje",
            "identifier": "pd_65miz6qf4u9y",
            "failure_message": null,
            "failure_error_code": null,
            "failure_error_type": null,
            "method": {
                "id": "6zyu010zn6wo",
                "name": "Test Payout Method",
                "short_code": "moneroo_payout_demo",
                "icon_url": "https://assets.cdn.moneroo.io/icons/circle/moneroo.svg"
            },
            "gateway": {
                "id": "8heokxp8yyxj",
                "account_name": "Moneroo Test Payout Gateway",
                "name": "Test Payout Gateway (Sandbox)",
                "short_code": "moneroo_payout_test",
                "icon_url": "https://assets.cdn.moneroo.io/icons/circle/moneroo.svg",
                "transaction_id": "b1f26365-3e02-4360-b646-39c2e91adce1",
                "transaction_status": "test_success",
                "transaction_failure_message": "This is a failed test payout, you do not use valid test phone number."
            }
        },
        "failed_at": null,
        "pending_at": "2023-12-26T22:04:49.000000Z",
        "success_at": "2023-12-26T22:04:50.000000Z"
    },
    "errors": null
}
The transaction details are contained in the data object. For instance:

The status of the transaction is in data.status.

The details of the customer are in the data.customer field.

The data.amount field says how much the customer was charged.

Some fields will vary depending on the type of transaction or state of the transaction.

The data.method field contains the payment method used by the customer.

The data.gateway field contains the payment gateway used to process the transaction.

The data.metadata field contains any custom metadata you may have provided when creating the transaction.

The data.context field contains the context of the transaction.

The data.app field contains the app details.

Field Name
Description
id

The public ID of the transaction.

status

The status of the transaction.

is_processed

Indicates whether the transaction is processed.

processed_at

The time when the transaction was processed.

amount

The amount involved in the transaction.

currency

The currency used in the transaction.

amount_formatted

The formatted amount involved in the transaction.

description

The description of the transaction.

return_url

The URL to return to after the transaction.

environment

The environment in which the transaction occurred.

initiated_at

The time when the transaction was initiated.

checkout_url

The URL to checkout the transaction.

app

The app associated with the transaction.

customer

The customer associated with the transaction.

method

The payment method associated with the transaction.

gateway

The payment gateway associated with the transaction.

metadata

The metadata associated with the transaction.

context

The context associated with the transaction.


🔎
Retrieve payout
The Moneroo platform's API offers an endpoint that allows you to fetch the detailed information of a specific payout transaction based on its unique transaction ID.

This guide will walk you through the process of retrieving a payout transaction using Moneroo's API.

Request

Copy
GET /v1/payouts/{payoutId} HTTP/1.1
Host: https://api.moneroo.io
Authorization: Bearer YOUR_SECRET_KEY
Content-Type: application/json
Accept: application/json
Parameters
Endpoint: /v1/payouts/{payoutId}

Method: GET

Name
Type
Required
Description
payoutId

String

Yes

The unique ID of the payout transaction to retrieve.

Response Structure
The response from this API endpoint will be in the standard Moneroo API response format.

You'll get a response that looks like this:


Copy
{
  "success": true,
  "message": "Payout transaction fetched successfully",
  "data": {
    // Details of the payout transaction
  }
}
Successful Response:

Upon successful retrieval, the endpoint returns a HTTP status code of 200, and the details of the payout transaction in the response body.

Error Responses:

If there's an issue with your request, the API will return an error response. The type of error response depends on the nature of the issue. Check out our response format page for more information.

Security Considerations
This endpoint requires an API key for authentication. Include the bearer token in the Authorization header of your request. Ensure the token is kept secure and not shared or exposed inappropriately.

Request example
Curl

Copy
curl --location --request GET 'https://api.moneroo.io/v1/payouts/{payoutId}' \
--header 'Authorization: Bearer YOUR_TOKEN'

const axios = require("axios");

const payoutId = "your_payout_public_id";
const token = "your_token";

axios
  .get(`https://api.moneroo.io/v1/payouts/${payoutId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  .then((response) => {
    if (response.status === 200) {
      const data = response.data;
      // Handle successful response and retrieve the payout transaction details
    } else {
      // Handle error response
    }
  })
  .catch((error) => {
    // Handle error
  });
Please replace 'payoutId' with the actual payout transaction Id and 'your_token' with your valid authorization token in the code snippets above.

Response example
You'll get a response that looks like this:


Copy
{
  "message": "Payout transaction fetched successfully",
  "data": {
    "id": "abc123",
    "status": "success",
    "is_processed": true,
    "processed_at": "2023-05-21T12:00:00Z",
    "amount": 100.0,
    "currency": "USD",
    "amount_formatted": "$100.00",
    "description": "Purchase of goods",
    "return_url": "https://example.com/return",
    "environment": "production",
    "initiated_at": "2023-05-21T11:00:00Z",
    "payout_phone_number": "+1234567890",
    "app": {
      "id": "app1",
      "name": "Example App",
      "icon_url": "https://example.com/icon.png"
    },
    "customer": {
      "id": "cust1",
      "first_name": "John",
      "last_name": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "address": "123 Main St",
      "city": "Springfield",
      "state": "IL",
      "country_code": "US",
      "country": "United States",
      "zip_code": "62701",
      "environment": "production",
      "created_at": "2023-01-01T00:00:00Z",
      "updated_at": "2023-05-21T00:00:00Z"
    },
    "method": {
      "name": "Credit Card",
      "code": "cc",
      "icon_url": "https://example.com/cc.png",
      "environment": "production"
    },
    "gateway": {
      "name": "Stripe",
      "account_name": "Acme Corp",
      "code": "stripe",
      "icon_url": "https://example.com/stripe.png",
      "environment": "production"
    },
    "metadata": {
      "custom_field1": "custom_value1",
      "custom_field2": "custom_value2"
    },
    "context": {
      "ip": "192.0.2.0",
      "user_agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (HTML, like Gecko) Chrome/58.0.3029.110 Safari/537",
      "country": "US",
      "local": "en-US"
    }
  }
}
The data field will contain the transaction details. The specific structure and content of this field depend on the details of the individual transaction.

✋
Payout status
When it comes to payouts, keeping track of their progress is crucial. To do this effectively, it's important to understand the different transaction statuses associated with each payout. At Moneroo, we have categorized these statuses into two groups: transitional and final.

Here's a simple view of payout transaction statuses in the image below:


Moneroo.io Payout Status
To provide a clear overview of the payout transaction statuses, refer to the table below:

Status
State
Description
initiated

Transactional

The payout transaction has been initiated and is currently in the queue, awaiting processing.

pending

Transactional

The payout transaction has been processed and is now waiting for a final status from the gateway or network.

failed

Final

The transaction has failed, and this is its final status.

success

Final

The transaction has been successfully completed, and this is its final status.

By understanding these different payout transaction statuses, you'll be able to effectively monitor and manage your payouts with ease.

🌍
Available methods
Below is a list of payout methods we support. The list is constantly growing, so check back for updates.

To learn more about a specific payout method and what payout gateway supports it, please check your connection list section.

You can get updated list of all available payout methods by calling GET /utils/payout/methods endpoint.


Copy
GET /utils/payout/methods HTTP/1.1
Host: https://api.moneroo.io
Accept: application/json
Payout methods
Name
Code
Currency
Countries
Airtel Congo

airtel_cd

CDF

CD

Airtel Money Malawi

airtel_mw

MWK

MW

Airtel Money Nigeria

airtel_ng

NGN

NG

Airtel Rwanda

airtel_rw

RWF

RW

Airtel Tanzania

airtel_tz

TZS

TZ

Airtel Uganda

airtel_ug

UGX

UG

Airtel Zambia

airtel_zm

ZMW

ZM

Djamo CI

djamo_ci

XOF

CI

Djamo SN

djamo_sn

XOF

SN

E-Money Senegal

e_money_sn

XOF

SN

EU Mobile Money Cameroon

eu_mobile_cm

XAF

CM

Free Money Senegal

freemoney_sn

XOF

SN

Halopesa

halopesa_tz

TZS

TZ

Test Payout Method

moneroo_payout_demo

USD

US

Moov Money Benin

moov_bj

XOF

BJ

Moov Money CI

moov_ci

XOF

CI

Moov Money Togo

moov_tg

XOF

TG

M-Pesa Kenya

mpesa_ke

KES

KE

Vodacom Tanzania

mpesa_tz

TZS

TZ

MTN MoMo Benin

mtn_bj

XOF

BJ

MTN MoMo CI

mtn_ci

XOF

CI

MTN MoMo Cameroon

mtn_cm

XAF

CM

MTN MoMo Ghana

mtn_gh

GHS

GH

MTN Nigeria

mtn_ng

NGN

NG

MTN MoMo Rwanda

mtn_rw

RWF

RW

MTN MoMo Uganda

mtn_ug

UGX

UG

MTN MoMo Zambia

mtn_zm

ZMW

ZM

Orange Congo

orange_cd

CDF

CD

Orange Money CI

orange_ci

XOF

CI

Orange Money Cameroon

orange_cm

XAF

CM

Orange Money Mali

orange_ml

XOF

ML

Orange Money Senegal

orange_sn

XOF

SN

Airtel/Tigo Ghana

tigo_gh

GHS

GH

Tigo Tanzania

tigo_tz

TZS

TZ

TNM Mpamba Malawi

tnm_mw

MWK

MW

Togocel Money

togocel

XOF

TG

Vodacom Congo

vodacom_cd

CDF

CD

Vodafone Ghana

vodafone_gh

GHS

GH

Wave CI

wave_ci

XOF

CI

Wave Senegal

wave_sn

XOF

SN

Zamtel Kwacha

zamtel_zm

ZMW

ZM

We are constantly adding new payout methods. If you don't see the payout method you need, please contact us.

Required fields
Each payout method has its own set of required fields, you should provide them in the request body when creating a payout.

Code
Fields
Type
Example
Description
airtel_cd

msisdn

integer

243XXXXXXXXX

Airtel Congo account phone number that will receive money in international format.

airtel_mw

msisdn

integer

265XXXXXXXXX

Airtel Money Malawi account phone number that will receive money in international format.

airtel_ng

msisdn

integer

234XXXXXXXXX

Airtel Money Nigeria account phone number that will receive money in international format.

airtel_rw

msisdn

integer

250XXXXXXXXX

Airtel Rwanda account phone number that will receive money in international format.

airtel_tz

msisdn

integer

255XXXXXXXXX

Airtel Tanzania account phone number that will receive money in international format.

airtel_ug

msisdn

integer

256XXXXXXXXX

Airtel Uganda account phone number that will receive money in international format.

airtel_zm

msisdn

integer

260XXXXXXXXX

Airtel Zambia account phone number that will receive money in international format.

djamo_ci

msisdn

integer

225XXXXXXXXX

Djamo CI account phone number that will receive money in international format.

djamo_sn

msisdn

integer

221XXXXXXXXX

Djamo SN account phone number that will receive money in international format.

e_money_sn

msisdn

integer

221XXXXXXXXX

E-Money Senegal account phone number that will receive money in international format.

eu_mobile_cm

msisdn

integer

237XXXXXXXXX

EU Mobile Money Cameroon account phone number that will receive money in international format.

freemoney_sn

msisdn

integer

221XXXXXXXXX

Free Money Senegal account phone number that will receive money in international format.

halopesa_tz

msisdn

integer

255XXXXXXXXX

Halopesa account phone number that will receive money in international format.

moneroo_payout_demo

account_number

integer

1XXXXXXXXX

Test Payout account phone number that will receive money in international format.

moov_bj

msisdn

integer

229XXXXXXXXX

Moov Money Benin account phone number that will receive money in international format.

moov_ci

msisdn

integer

225XXXXXXXXX

Moov Money CI account phone number that will receive money in international format.

moov_tg

msisdn

integer

228XXXXXXXXX

Moov Money Togo account phone number that will receive money in international format.

mpesa_ke

msisdn

integer

254XXXXXXXXX

M-Pesa Kenya account phone number that will receive money in international format.

mpesa_tz

msisdn

integer

255XXXXXXXXX

Vodacom Tanzania account phone number that will receive money in international format.

mtn_bj

msisdn

integer

229XXXXXXXXX

MTN MoMo Benin account phone number that will receive money in international format.

mtn_ci

msisdn

integer

225XXXXXXXXX

MTN MoMo CI account phone number that will receive money in international format.

mtn_cm

msisdn

integer

237XXXXXXXXX

MTN MoMo Cameroon account phone number that will receive money in international format.

mtn_gh

msisdn

integer

233XXXXXXXXX

MTN MoMo Ghana account phone number that will receive money in international format.

mtn_ng

msisdn

integer

234XXXXXXXXX

MTN Nigeria account phone number that will receive money in international format.

mtn_rw

msisdn

integer

250XXXXXXXXX

MTN MoMo Rwanda account phone number that will receive money in international format.

mtn_ug

msisdn

integer

256XXXXXXXXX

MTN MoMo Uganda account phone number that will receive money in international format.

mtn_zm

msisdn

integer

260XXXXXXXXX

MTN MoMo Zambia account phone number that will receive money in international format.

orange_cd

msisdn

integer

243XXXXXXXXX

Orange Congo account phone number that will receive money in international format.

orange_ci

msisdn

integer

225XXXXXXXXX

Orange Money CI account phone number that will receive money in international format.

orange_cm

msisdn

integer

237XXXXXXXXX

Orange Money Cameroon account phone number that will receive money in international format.

orange_ml

msisdn

integer

223XXXXXXXXX

Orange Money Mali account phone number that will receive money in international format.

orange_sn

msisdn

integer

221XXXXXXXXX

Orange Money Senegal account phone number that will receive money in international format.

tigo_gh

msisdn

integer

233XXXXXXXXX

Airtel/Tigo Ghana account phone number that will receive money in international format.

tigo_tz

msisdn

integer

255XXXXXXXXX

Tigo Tanzania account phone number that will receive money in international format.

tnm_mw

msisdn

integer

265XXXXXXXXX

TNM Mpamba Malawi account phone number that will receive money in international format.

togocel

msisdn

integer

228XXXXXXXXX

Togocel Money account phone number that will receive money in international format.

vodacom_cd

msisdn

integer

243XXXXXXXXX

Vodacom Congo account phone number that will receive money in international format.

vodafone_gh

msisdn

integer

233XXXXXXXXX

Vodafone Ghana account phone number that will receive money in international format.

wave_ci

msisdn

integer

225XXXXXXXXX

Wave CI account phone number that will receive money in international format.

wave_sn

msisdn

integer

221XXXXXXXXX

Wave Senegal account phone number that will receive money in international format.

zamtel_zm

msisdn

integer

260XXXXXXXXX

Zamtel Kwacha account phone number that will receive money in international format.
