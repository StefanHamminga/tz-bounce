#!/bin/bash

# Client script for tz-bounce server:
# https://www.npmjs.com/package/tz-bounce
# Drop this in `/etc/NetworkManager/dispatcher.d/` for automatic timezone
# setting.

# Requires curl and systemd

IF=$1
STATUS=$2

# For privacy use your own server or pick one at random from a pool
SERVER="https://prjct.net/tzbounce"

if [ "$STATUS" = "up" ]; then
    # curl $SERVER
    TZ=`curl -sS $SERVER | egrep "^Timezone:" | sed s/"Timezone: "//`
    if [ "$TZ" = "null" ]; then
        logger -s "tz-bounce client: Unable to determine timezone. Doing nothing."
    else
        MATCH=`timedatectl list-timezones | egrep "^${TZ}$"`
        if [ "$MATCH" = "" ]; then
            logger -s "tz-bounce client: Timezone '$TZ' doesn't match any locally available zone."
        else
            timedatectl set-timezone "$TZ" && logger -s "tz-bounce client: Updated timezone to $TZ." || logger -s "tz-bounce client: Unable to set timezone."
        fi
    fi
fi
