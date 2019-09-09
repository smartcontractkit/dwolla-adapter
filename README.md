# Dwolla External Adapter

## How to use

* Install dependencies `yarn install`

* Build TypeScript files `yarn build`

* Set up [Environment variables](#environment-variables)

* *Optional:* Run tests `yarn test`. Please read [Testing](#testing) first!

* Run this adapter using a serverless provider:
    * use the `handler()` wrapper for AWS Lambda
    * use the `gcpservice()` wrapper for GCP

* Use one of the available [Available methods](#available-methods)
    * Set method name in `data.method`, along with method-specific parameters

To create a ZIP file to upload to AWS/GCP, run:

```bash
zip -r cl-ea.zip .
```

## Environment variables

| Variable      |               | Description | Example |
|---------------|:-------------:|------------- |:---------:|
| `ENVIRONMENT`     | *Optional*  | `PRODUCTION` or `SANDBOX` | `SANDBOX` |
| `DWOLLA_APP_KEY`  | **Required**  | Your Dwolla app ID | `EBWKjlELKMYqRNQ6sYvFo64FtaRLRR5BdHEESmha49TM` |
| `DWOLLA_APP_SECRET`  | **Required**  | Your Dwolla app Secret | `EO422dn3gQLgDbuwqTjzrFgFtaRLRR5BdHEESmha49TM` |
| `API_METHOD` | *Optional* | Set a specific method to use for this adapter. Overwrites `method` in request body. | `sendTransfer` |

## Testing

Set the `MODE` env variable to `sandbox`.

In order to test sending payouts, make sure your funding source has a positive balance.
You also need to create a customer and funding source to send to.
These env vars can be set with `FUNDING_SOURCE` and `TEST_DESTINATION`.

To test the getTransfer method with another transfer other than the one created in the test, set the `TEST_TRANSFER_ID` env var.

## Available methods

Method can be specified by the `method` key in the request body or the `API_METHOD` environment variable. If the 
environment variable is set, it takes precedence over the method specified in the request body.

### sendTransfer

Send a money transfer using the Dwolla API.

#### Request

| Variable | Type |   | Description |
|----------|------|---|-------------|
| `amount` | String | **Required** | Amount to send. |
| `currency` | String | *Optional* | Three-character ISO-4217 currency code. Defaults to `USD`. |
| `destination` | String | **Required** | ID of the funding source to send to. |

#### Response

Returns the transfer ID as "result" if successful.

```json
{  
  "result": "15c6bcce-46f7-e811-8112-e8dd3bececa8"
}
```

### getTransfer

Get details on a transfer.

#### Request

| Variable | Type |   | Description |
|----------|------|---|-------------|
| `transfer_id` | String | **Required** | Transfer ID to look up |

#### Response

Returns the transfer status as "result", as well as the transfer object.

```json
{
   "_links":{
      "cancel":{
         "href":"https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"transfer"
      },
      "self":{
         "href":"https://api-sandbox.dwolla.com/transfers/15c6bcce-46f7-e811-8112-e8dd3bececa8",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"transfer"
      },
      "source":{
         "href":"https://api-sandbox.dwolla.com/accounts/62e88a41-f5d0-4a79-90b3-188cf11a3966",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"account"
      },
      "source-funding-source":{
         "href":"https://api-sandbox.dwolla.com/funding-sources/12a0eaf9-9561-468d-bdeb-186b536aa2ed",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"funding-source"
      },
      "funding-transfer":{
         "href":"https://api-sandbox.dwolla.com/transfers/14c6bcce-46f7-e811-8112-e8dd3bececa8",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"transfer"
      },
      "destination":{
         "href":"https://api-sandbox.dwolla.com/customers/d295106b-ca20-41ad-9774-286e34fd3c2d",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"customer"
      },
      "destination-funding-source":{
         "href":"https://api-sandbox.dwolla.com/funding-sources/500f8e0e-dfd5-431b-83e0-cd6632e63fcb",
         "type":"application/vnd.dwolla.v1.hal+json",
         "resource-type":"funding-source"
      }
   },
   "id":"15c6bcce-46f7-e811-8112-e8dd3bececa8",
   "status":"pending",
   "result":"pending",
   "amount":{
      "value":"42.00",
      "currency":"USD"
   },
   "created":"2018-12-03T22:00:22.970Z",
   "clearing":{
      "source":"standard"
   }
}
```
