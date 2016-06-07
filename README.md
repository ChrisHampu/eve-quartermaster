EVE Quartermaster
======
**EVE Quartermaster** is an application designed to help corporations and alliances keep track of all of their contracts.
Members can login and view contracts, search by their name or location, and track contract expiry times.
Additionally, members can place requests for specific contracts to be seeded. This can be done by submitting a
list of requested items, selecting a station, and giving their request a title. Once the contract has been seeded
to the corporation, the user will get a notification that their requests is fulfilled.

Notable features of this application include:
* Automatic fulfillment of requests when matching contracts are seeded
* User notifications when requests are fulfilled
* Realtime searching through contracts/requests
* Autocomplete when typing item names/stations for creating requests
* Importing/exporting EFT fits to and from contract requests
* Sorting contracts by location, price, status, and name

#### Screenshot
![Screenshot software](http://url/screenshot-software.png "screenshot software")

## Usage

### Requirements

  * Mac OS X, Windows, or Linux
  * [Node.js](https://nodejs.org/) v5.0 or newer
  * NPM v3.3 or newer (new to [npm](https://docs.npmjs.com/)?)
  * PostgresSQL v9.5.3 or newer

### Configuration

  * Create the PostgresSQL database by using the 'schema.sql' in the root directory
  * Configure a PostgresSQL username + password to access the configured database
  * Create an application on the EVE Developers website and get the API key/secret
  * Create a corporate API key and get the API key/vCode (ensure contract permissions are set)
  * Complete configuration in the file 'src/config.js' with SQL details, application keys, and corporate keys
  * For security, set the 'jwt' and 'session' secrets to cryptographically secure random strings
  * If the application should only be available to a single corporation (and not alliance-wide), set 'corp_only' to true in 'src/config.js'

### Building

  * Run 'npm install'
  * Run 'npm run build' for a development build
  * Run 'npm run build -- --release' for a production build

### Running
  * Run 'npm start' to run in development mode
  * Run 'npm start -- --release' to run in production mode

## TODO
* Complete all the various "TODO's" littered in the code
* Add a maximum number of requests per member (configurable) to avoid spam
* Proper support for a contract request to be made for a variable number of contracts with those items (bulk request)
* Add support for user roles for management of the app/contracts and privileges
* And anything else upon request
* Pagination for contract/request pages. Especially for larger corporations/alliances

## Contributors

### Contributors on GitHub
* [Contributors](https://github.com/username/sw-name/graphs/contributors)

### Core Third party libraries
* ReactJS
* GraphQL
* Babel/Webpack
* Express
* Passport

## License 
* MIT

## Contact
#### Developer/Company