# MMM-Roomba

This is a module for the [MagicMirror²](https://github.com/MichMich/MagicMirror/). It pulls data (name + job, bin and battery status) from a Roomba running on the local network using [Dorita980](https://github.com/koalazak/dorita980) and displays them on the mirror.

![Alt text](/screenshots/charging_full.png?raw=true "Screenshot")

## Installation

1. Navigate into your MagicMirror's `modules` folder and execute `git clone https://github.com/relm/MMM-Roomba.git`. A new folder will appear navigate into it.
2. Execute `npm install` to install the node dependencies.

## Using the module

To use this module, add the following configuration block to the modules array in the `config/config.js` file:

```js
var config = {
    modules: [
        {
            module: 'MMM-Roomba',
            position: 'top_right',
            header: 'Roomba', // Optional
            config: {
                // See below for configurable options
                robots: [
                    {
                        username: 'xxxxxxxxxxxxx',
                        password: ':1:1486937829:gktkDoYpWaDxCfGh',
                        ipAddress: '192.168.1.44'
                    }
                ]
            }
        }
    ]
}
```

## Configuration options

| Option           | Description                                                                                                               |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------- |
| `username`       | _Required_ Username of Roomba. See [Dorita980](https://github.com/koalazak/dorita980) for more information.               |
| `password`       | _Required_ Password of Roomba. See [Dorita980](https://github.com/koalazak/dorita980) for more information.               |
| `ipAddress`      | _Required_ Local IP address of Roomba. See [Dorita980](https://github.com/koalazak/dorita980) for more information.       |
| `updateInterval` | _Optional_ How often the content will be fetched. <br><br>**Type:** `int`(milliseconds) <br>Default 60000 (1 minute)      |
| `animationSpeed` | _Optional_ Speed of the update animation. <br><br>**Type:** `int`(milliseconds) <br>Default 2000 milliseconds (2 seconds) |

## Known Issues

- Error: `SSL routines:OPENSSL_internal:NO_CIPHER_MATCH` - Node v12

  Solution: `ROBOT_CIPHERS=AES128-SHA` before staring MagicMirror

## Dependencies

- [Dorita980](https://github.com/koalazak/dorita980) (installed via `npm install`)
