# QuickDoc Manager Macro

## About

The QuickDoc Manager macro allows you to easily build and display web content on the Cisco Room Navigator running in controller mode

The script will automatically generate a UI for you, based on the site information you provide in the Site_List object

The QR Code capability comes from the [QR Code Generator Site](https://goqr.me/) and their [API](https://goqr.me/api/) stack.


[![QuickDocs Manager UI](/images/uDocsQR-controlInterface.png)](#)

| Minimum RoomOS Version| Webex Cloud | Webex Edge (Hybrid Cloud) | On-Premise | Microsoft Teams Room<br>On Cisco Devices |
|:------------|:------------|:--------------------------|:-----------|:-----------------------------------------|
| RoomOS 11.8.X | ✅ Yes       | ✅ Yes                    | ✅ Yes     | ❌ No                                    | 

## Solution Requirements

### Minimum RoomOS Version
- RoomOS 11.8.X or Higher

### Compatible Devices
- Cisco Room Navigator
  - Must be setup as a Controller paired to any compatible device running as RoomOS

## UserInterface Guide

### Touch Panel

The User interface will spawn when the Macro boots up

By default, you will finds a ```Docs and Community Spaces``` panel on the home screen of the touch panel. The name, icon and color of this panel can be altered in the config object of the Macro.

[![QuickDocs Manager Homescreen](/images/uDocsQR-homescreen.png)](#)

When you open the panel, you'll see all configured sits, paginated by their category, with options to either open the page, or display the QR code.

[![QuickDocs Manager Control interface](/images/uDocsQR-controlInterface.png)](#)

Selecting ```Open Site``` will tell the service to open the page you've configured on the touch panel

[![QuickDocs Manager Web Page](/images/uDocsQR-webinterface.png)](#)

Conversely, selecting ```QR Code``` will open a QR Code that, when scanned with a smart phone, will open the target site on your phone's default browser.

[![QuickDocs Manager QR Page](/images/uDocsQR-qrInterface.png)](#)

## Device Configuration

1. Log into the Codec's Web Interface
2. Navigate to Settings > Configurations > NetworkServices
3. Set CommonProxy to Enabled
4. Save the configuration

> CommonProxy allows the Room Navigator to access Web Content while connected to a Codec's Link Local Network. This xConfiguration can not be enabled via the xAPI and must be enabled in the Web Interface.

[![Common Proxy Setting in Codec Web Interface](/images/uDocsQR-CommonProxy.png)](#)

**NOTE**: If you're navigator is paired to the codec over lan, then feel free to skip steps 1-4 above

## Macro Installation

1. Download a copy of the QuickDoc_Manager.js file
2. Log into the Codec's Web Interface
3. Navigate to the Macro Editor
4. Select import from file the the QuickDoc_Manager.js
5. Save the and Activate the Macro

## Macro Configuration

At the top level of the macro, you will find a configuration object.

Here you can edit the Name of the Panel, the Color using a Hexadecimal Color Code and can alter the default Icon based on the Icons found in the UI Extensions Editor

```javascript
const config = {
  UserInterface: {
    Name: 'Docs and Community Spaces',          // AcceptedValues: String || Configure the Name of the Quick Docs Panel
    Color: '800000',                            // AcceptedValues: String || Configure the Color of the Quick Docs Panel with a hexadecimal color code
    Icon: 'Language'                            // AcceptedValues: String || Configure the Icon of the Quick Docs Panel
  }
};
```

Below the config object is the Site_List object, this is where all the configured sites are set.

This is an array, and can accept any number of items added to it. Follow the format below to add/remove any web pages you'd like for your use case.

```javascript
const Site_List = [
  {
    Name: 'xAPI Developers and Integrations',   // AcceptedValues: String || Configure the user facing name of the Site
    Url: 'https://eurl.io/#ywxvh25AA',          // AcceptedValues: String || Configure the URL of the site
    Category: 'Webex Spaces',                   // AcceptedValues: String || Configure a Category for the Site, leave as '' if a category is unneeded
    EnableQR: true                              // AcceptedValues: Boolean || If set to true, the QR Code button will appear for this site
  },
  {
    Name: 'AV Integrators Discussion with Cisco',
    Url: 'https://eurl.io/#rkp76XDrG',
    Category: 'Webex Spaces',
    EnableQR: true
  },
  {
    Name: 'RoomOS xAPI Docs and Samples',
    Url: 'https://roomos.cisco.com/',
    Category: 'Developer Sites',
    EnableQR: true
  },
  {
    Name: 'Developer.Webex.Com',
    Url: 'https://developer.webex.com/',
    Category: '',
    EnableQR: true
  }
];
```

## FAQ

### Is this Macro Supported by Cisco TAC?
- No, all Macros are considered Custom Code by Cisco and are not supported.

## How did you generate a QR Code on the Touch Panel?
- The QR Code capability comes from the [QR Code Generator Site](https://goqr.me/) and their [API](https://goqr.me/api/) stack!

### Where did the General Page come from?
- If you don't provide a Category to any of the sites you've configured, the site will be placed in the General page by default

### Why is the Panel button not generating?
- If there are no sites configured in the ```Site_List``` object, then the macro will remove the panel and disable itself
- You need at least 1 site configured for this solution to work 😉