#!/usr/bin/env node

/* TZ-Bounce
This program is free software: you can redistribute it and/or modify it under
the terms of the GNU General Public License as published by the Free Software
Foundation, either version 3 of the License, or (at your option) any later
version.

This program is distributed in the hope that it will be useful, but WITHOUT ANY
WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A
PARTICULAR PURPOSE.  See the GNU General Public License for more details.

You should have received a copy of the GNU General Public License along with
this program.  If not, see <http://www.gnu.org/licenses/>.
*/

"use strict";
const api_name  = 'tz-bounce yaml v1.0.0';
const port      = process.env.TZBOUNCEPORT || process.argv[2] || 8000;
const requestIp = require('request-ip');
const geoip     = require('geoip-lite');
const tzlookup  = require("tz-lookup");
const http      = require('http');

// const util      = require('util');
// const inspect   = function(desc, item) { if (!(item)) {item = desc; desc = "";} console.log(desc, util.inspect(item, {colors: true}))};

// Configure our HTTP server to respond with Hello World to all requests.
const server    = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    let ip    = requestIp.getClientIp(request);
    if (ip) {
        ip = ip.replace("::ffff:", ""); // Strip out IPv6ifiaction
    }
    // inspect("IP address: ", ip);
    let loc   = geoip.lookup(ip);
    // inspect("Geo location: ", loc);
    let tz;
    if (loc && loc.ll) {
        tz = tzlookup(loc.ll[0], loc.ll[1]);
    }
    // inspect("Timezone ", tz);
    response.end("Api: " + api_name + "\n" +
                 "PublicIP: " + (ip || "null") + "\n" +
                 "Timezone: " + (tz || "null") + "\n" +
                 "Location: " + ((loc) ?
                     ("\n\tCountry: " + (loc.country || "null") + "\n" +
                 "\tRegion: " + (loc.region || "null") + "\n" +
                 "\tCity: " + (loc.city || "null") + "\n" +
                 "\tMetro: " + (loc.metro || "null") + "\n" +
                 "\tLatitude: " + (loc.ll[0] || "null") + "\n" +
                 "\tLongitude: " + (loc.ll[1] || "null") + "\n") : "null\n"));
});

server.listen(port);
if (!(process.env.TZBOUNCEPORT) && !(process.argv[2]))
    console.log("Use `TZBOUNCEPORT=nnnn ./index.js` or `./index.js nnnn` to set the listening port")
console.log("TZ-bounce server listening on port: " + port);
