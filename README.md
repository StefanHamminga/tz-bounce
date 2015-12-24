# tz-bounce
Node.js based timezone bounce server. Uses the public IP to reply a matched location and timezone.

## Installation

```bash
cd mysites
git clone https://github.com/StefanHamminga/tz-bounce.git
cd tz-bounce
npm install
```

## Client usage

```bash
curl https://prjct.net/tzbounce
```

replies a [YAML](https://en.wikipedia.org/wiki/YAML) formatted message containing matched information:

```yaml
Api: tz-bounce yaml v1.0.0
PublicIP: 14.200.66.162
Timezone: Australia/Sydney
Location:
        Country: AU
        Region: 02
        City: Bondi
        Metro: null
        Latitude: -33.8939
        Longitude: 151.2498
```

## Automatic timezone selection using NetworkManager

The `client.sh` tool in the repository can be placed in `/etc/NetworkManager/dispatcher.d/` to update the timezone upon connecting to a network.

## License & repository

This project is available on [GitHub](https://github.com/StefanHamminga/tz-bounce) and [npm](https://www.npmjs.com/package/tz-bounce)

Copyright 2015 [Stefan Hamminga](stefan@prjct.net) - [prjct.net](https://prjct.net)

License: [GPL v3.0](https://www.gnu.org/licenses/gpl-3.0.en.html). The license text is included in the repository.
