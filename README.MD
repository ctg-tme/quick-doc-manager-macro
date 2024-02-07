# QuickDoc Manager Macro

## About

- The QuickDoc Manager macro allows you to easily build and display web content on the Cisco Room Navigator running in controller mode
- The script will automatically generate a UI for you, based on the site information you provide in the Site_List object

[![QuickDocs Manager UI](/images/uDocsQR-controlInterface.png)](#)

| Minimum RoomOs Version | Webex Cloud | Webex Edge (Hybrid Cloud) | On-Premise | Microsoft Teams Room<br>On Cisco Devices |
|:-----------------------|:------------|:--------------------------|:-----------|:-----------------------------------------|
| 11.8.X                 | ✅ Yes       | ✅ Yes                    | ✅ Yes     | ❌ No                                    | 

## Solution Requirements

### Minimum RoomOS Version
- RoomOS 11.8.X or Higher

### Compatible Devices
- Cisco Room Navigator
  - Must be setup as a Controller paired to any compatible device

## UserInterface Guide

## Device Configuration

1. Log into the Codec's Web Interface
2. Navigate to Settings > Configurations > NetworkServices
3. Set CommonProxy to Enabled
4. Save the configuration

> CommonProxy allows the Room Navigator to access Web Content while connected to a Codec's Link Local Network

> If you're navigator is paired to the codec over lan, this feel free to skip steps 1-4 above

## Macro Installation

1. Download a copy of the QuickDoc_Manager.js file
2. Log into the Codec's Web Interface
3. Navigate to the Macro Editor
4. Select import from file the the QuickDoc_Manager.js
5. Save the Macro
6. Then Activate the Macro
7. You should see the UI show in the Room Navigator Interface

## Macro Configuration

```javascript
const config = {
  UserInterface: {                              // Edit the Panel button generated on the Room Navigator
    Name: 'Docs and Community Spaces',
    Color: '800000',
    Icon: 'Language'
  }
}
```

## FAQ


```javascript
const Site_List = [
  {
    Name: 'xAPI Developers and Integrations',   // Name visible to the User
    Url: 'https://eurl.io/#ywxvh25AA',          // URL to the Site
    Category: 'Webex Spaces',                   // Category of Document. Use this to paginate URLs
    EnableQR: true
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
]
```