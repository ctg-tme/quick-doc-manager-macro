/********************************************************
Copyright (c) 2024 Cisco and/or its affiliates.
This software is licensed to you under the terms of the Cisco Sample
Code License, Version 1.1 (the "License"). You may obtain a copy of the
License at
               https://developer.cisco.com/docs/licenses
All use of the material herein must be in accordance with the terms of
the License. All rights not expressly granted by the License are
reserved. Unless required by applicable law or agreed to separately in
writing, software distributed under the License is distributed on an "AS
IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express
or implied.
*********************************************************x

 * Author(s)                Robert(Bobby) McGonigle
 *                          Technical Marketing Engineering, Technical Leader
 *                          Cisco Systems
 * 
 * Description: 
 *  - Easily add documents to the Room Navigator
 *  - Provide a Name, URL and Category, and the UI will generate a panel for you with a link to open and a QR to open
 * 
 * NOTE:
 *    This Macro will not function on MTR registered Cisco Devices
 *    This Macro assumes you're interacting with a paired Room Navigator
*/

import xapi from 'xapi';

const config = {
  UserInterface: {
    Name: 'Docs and Community Spaces',          // AcceptedValues: String || Configure the Name of the Quick Docs Panel
    Color: '800000',                            // AcceptedValues: String || Configure the Color of the Quick Docs Panel with a hexadecimal color code
    Icon: 'Language'                            // AcceptedValues: String || Configure the Icon of the Quick Docs Panel
  }
};

//Edit the list below to add or remove more Web Accessible Docs
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

const qrDocsPanelId = 'uDocsQR~panel';

async function buildUI() {
  console.log({ Message: 'Building Userinterface...' })
  let pageList = [];
  Site_List.forEach((element, index) => {
    if (element.Category == '') {
      Site_List[index].Category = 'General';
    };
    pageList.push(element.Category);
  });
  pageList = [...new Set(pageList)];
  pageList = pageList.sort((a, b) => {
    if (a === 'General') {
      return -1; // Move 'General' to the beginning
    } else if (b === 'General') {
      return 1; // Move 'General' to the beginning
    } else {
      return a.localeCompare(b); // Sort alphabetically
    };
  });

  console.info({ Info: `Page Categories discovered`, Categories: pageList });

  let pages = {};

  pageList.forEach(element => { pages[element] = {}; pages[element].buttonXML = `` });

  pageList.forEach(element => {
    Site_List.forEach(el => {
      if (element == el.Category) {
        console.debug({ Debug: `Adding [${el.Name}] to [${el.Category}] page`, Url: el.Url });
        if (el.EnableQR) {
          pages[element].buttonXML = pages[element].buttonXML + `<Row>
            <Name>${el.Name}</Name>
            <Widget>
              <WidgetId>uDocsQR~${el.Category}~${el.Name}~OpenSite~${el.Url}</WidgetId>
              <Name>Open Site</Name>
              <Type>Button</Type>
              <Options>size=2</Options>
            </Widget>
            <Widget>
              <WidgetId>uDocsQR~${el.Category}~${el.Name}~OpenQRCode~${el.Url}</WidgetId>
              <Name>QR Code</Name>
              <Type>Button</Type>
              <Options>size=2</Options>
            </Widget>
          </Row>`;
        } else {
          pages[element].buttonXML = pages[element].buttonXML + `<Row>
            <Name>${el.Name}</Name>
            <Widget>
              <WidgetId>uDocsQR~${el.Category}~${el.Name}~OpenSite~${el.Url}</WidgetId>
              <Name>Open Site</Name>
              <Type>Button</Type>
              <Options>size=4</Options>
            </Widget>
          </Row>`;
        };
      };
    });

    pages[element].pageXML = `<Page>
      <Name>${element}</Name>
        ${pages[element].buttonXML}
      <PageId>uDocsQR~[Category]</PageId>
      <Options/>
    </Page>`;
  });

  let allPages = ``;

  pageList.forEach(element => {
    allPages = allPages + pages[element].pageXML;
  });

  let xml = `<Extensions>
    <Panel>
      <PanelId>uDocsQR~panel</PanelId>
      <Location>HomeScreen</Location>
      <Icon>${config.UserInterface.Icon}</Icon>
      <Name>${config.UserInterface.Name}</Name>
      <Color>#${config.UserInterface.Color}</Color>
      <ActivityType>Custom</ActivityType>
      ${allPages}
    </Panel>
  </Extensions>
  `;

  await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: qrDocsPanelId }, xml);
  console.log({ Message: `Userinterface built, look for a panel titled [${config.UserInterface.Name}] on your touch panel` });
}

async function openWebView(name = 'Cisco', url = 'https://cisco.com', qrMode = false) {
  if (qrMode) {
    xapi.Command.UserInterface.WebView.Display({
      Title: name + ' QR Code',
      Url: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=500x500`,
      Target: 'Controller',
      Mode: 'Modal'
    });
    console.log({ Message: 'QR Displayed', Name: name, URL: url });
    return;
  };

  xapi.Command.UserInterface.WebView.Display({ Title: name, Url: url, Target: 'Controller', Mode: 'Modal' });
  console.log({ Message: 'Website Displayed', Name: name, URL: url });
  return;
};

function delay(ms) { return new Promise(resolve => setTimeout(resolve, ms)) };

async function init() {

  if (Site_List.length == 0) {

    console.error({
      Error: 'Sites not configured in SiteList',
      Tip: 'Configure the Sitelist Object at the top of the Macro with at least 1 configured site',
      Action: 'Disabling this macro in 5 seconds due to unresolvable conflict'
    });

    await delay(5000)
    await xapi.Command.UserInterface.Extensions.Panel.Remove({ PanelId: qrDocsPanelId })
    await xapi.Command.Macros.Macro.Deactivate({ Name: _main_macro_name() });
    await xapi.Command.Macros.Runtime.Restart();

    return;
  };

  buildUI();

  xapi.Event.UserInterface.Extensions.Widget.Action.on(event => {
    if (event.Type == 'released' && event.WidgetId.includes('uDocsQR~')) {
      let [app, category, name, action, url] = event.WidgetId.split(`~`);
      switch (action) {
        case 'OpenSite':
          openWebView(name, url, false);
          break;
        case 'OpenQRCode':
          openWebView(name, url, true);
          break;
      };
    };
  });
}

init();