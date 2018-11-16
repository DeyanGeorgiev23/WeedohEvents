import React, { Component } from 'react';
import { render } from 'react-dom';
import { Tabs, Tab, TabPanel, TabList } from 'react-web-tabs';
 
 
export default class App extends Component {
    render() {
        return (
            <Tabs
                defaultTab="one"
            // onChange={(tabId) => { console.log(tabId); }}
            >
                <TabList>
                    <Tab tabFor="one">Tab 1</Tab>
                    <Tab tabFor="two">Tab 2</Tab>
                    <Tab tabFor="three">Tab 3</Tab>
                </TabList>
                <TabPanel tabId="one">
                    <p>Tab 1 content</p>
                </TabPanel>
                <TabPanel tabId="two">
                    <p>Tab 2 content</p>
                </TabPanel>
                <TabPanel tabId="three">
                    <p>Tab 3 content</p>
                </TabPanel>
            </Tabs>
        );
    }
}
