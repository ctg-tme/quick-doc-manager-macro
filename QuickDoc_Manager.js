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
  UserInterface: {                              // Edit the Panel button generated on the Room Navigator
    Name: 'Docs and Community Spaces',
    Color: '800000',
    Icon: 'Language'
  }
}

//Edit the list below to add or remove more Web Accessible Docs
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

async function buildUI() {
  let pageList = []
  Site_List.forEach((element, index) => {
    if (element.Category == '') {
      Site_List[index].Category = 'General'
    }
    pageList.push(element.Category)
  })
  pageList = [...new Set(pageList)];
  pageList = pageList.sort((a, b) => {
    if (a === 'General') {
      return -1; // Move 'General' to the beginning
    } else if (b === 'General') {
      return 1; // Move 'General' to the beginning
    } else {
      return a.localeCompare(b); // Sort alphabetically
    }
  });

  let pages = {}

  pageList.forEach(element => { pages[element] = {}; pages[element].buttonXML = `` })

  pageList.forEach(element => {
    //pages[element] = {};
    //pages[element].buttonXML = ``
    Site_List.forEach(el => {
      if (element == el.Category) {
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
          </Row>`
        } else {
          pages[element].buttonXML = pages[element].buttonXML + `<Row>
            <Name>${el.Name}</Name>
            <Widget>
              <WidgetId>uDocsQR~${el.Category}~${el.Name}~OpenSite~${el.Url}</WidgetId>
              <Name>Open Site</Name>
              <Type>Button</Type>
              <Options>size=4</Options>
            </Widget>
          </Row>`
        }
      }
    })

    pages[element].pageXML = `<Page>
      <Name>${element}</Name>
        ${pages[element].buttonXML}
      <PageId>uDocsQR~[Category]</PageId>
      <Options/>
    </Page>`
  })

  let allPages = ``

  pageList.forEach(element => {
    allPages = allPages + pages[element].pageXML
  })

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
  `

  await xapi.Command.UserInterface.Extensions.Panel.Save({ PanelId: 'uDocsQR~panel' }, xml)
}

buildUI()

async function openWebView(name = 'Cisco', url = 'https://cisco.com', qrMode = false) {
  if (qrMode) {
    xapi.Command.UserInterface.WebView.Display({ Title: name + ' QR Code', Url: `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(url)}&size=500x500`, Target: 'Controller', Mode: 'Modal' })
    console.log({ Message: 'QR Displayed', Name: name, URL: url })
    return
  }

  xapi.Command.UserInterface.WebView.Display({ Title: name, Url: url, Target: 'Controller', Mode: 'Modal' })
  console.log({ Message: 'Website Displayed', Name: name, URL: url })
  return
}

xapi.Event.UserInterface.Extensions.Widget.Action.on(event => {
  if (event.Type == 'released' && event.WidgetId.includes('uDocsQR~')) {
    let [app, category, name, action, url] = event.WidgetId.split(`~`)

    switch (action) {
      case 'OpenSite':
        openWebView(name, url, false)
        break;
      case 'OpenQRCode':
        openWebView(name, url, true)
        break;
    }
  }
})