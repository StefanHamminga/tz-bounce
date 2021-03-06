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
const ind       = "    ";
const requestIp = require('request-ip');
const geoip     = require('geoip-lite');
const tzlookup  = require("tz-lookup");
const http      = require('http');

// const util      = require('util');
// const inspect   = function(desc, item) { if (!(item)) {item = desc; desc = "";} console.log(desc, util.inspect(item, {colors: true}))};

// Simple runtime / time to live caching
const ttl       = 24 * 60 * 60 * 1000; // ms
const cache     = {};

const server    = http.createServer(function (request, response) {
    response.writeHead(200, {"Content-Type": "text/plain"});
    let ip = requestIp.getClientIp(request);
    if (ip) {
        ip = ip.replace("::ffff:", ""); // Strip out IPv6ification
    }
    // inspect("IP address: ", ip);

    let loc;
    let tz;
    if (cache[ip] && cache[ip].maxage > new Date()) {
        loc = cache[ip].loc;
        tz = cache[ip].tz;
    } else {
        loc = geoip.lookup(ip);
        // inspect("Geo location: ", loc);
        if (loc && loc.ll) {
            tz = tzlookup(loc.ll[0], loc.ll[1]);
            if (tz) {
                cache[ip] = { ip: ip, loc: loc, tz: tz, maxage: new Date() + ttl };
            }
        }
        // inspect("Timezone ", tz);
    }
    response.end("Api: " + api_name + "\n" +
                 "PublicIP: " + (ip || "null") + "\n" +
                 "Timezone: " + (tz || "null") + "\n" +
                 "Location: " + ((loc) ?
                     ("\n" + ind + "Country: " + (loc.country || "null") + "\n" +
                     ind + "Region: " + (loc.region || "null") + "\n" +
                     ind + "City: " + (loc.city || "null") + "\n" +
                     ind + "Metro: " + (loc.metro || "null") + "\n" +
                     ind + "Latitude: " + (loc.ll[0] || "null") + "\n" +
                     ind + "Longitude: " + (loc.ll[1] || "null") + "\n") : "null\n"));
});

server.listen(port);
if (!(process.env.TZBOUNCEPORT) && !(process.argv[2]))
    console.log("Use `TZBOUNCEPORT=nnnn ./index.js` or `./index.js nnnn` to set the listening port")
console.log("TZ-bounce server listening on port: " + port);
