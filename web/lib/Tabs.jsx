'use strict'
import {h} from 'virtual-dom'
import Store from './Store'

function Tabs (attr, children) {
  var state = Store.instance.state[attr.slice]
  return <div id={attr.slice} className="Tabs">
    <div className="Tabs__tabList">
      {
        children.filter(child => child.element === 'Tab').map((child, i) => {
          var classNames = ['Tabs__tab']
          classNames.push(`Tabs__tab--${state.activeTabIndex === i ? 'active' : 'inactive'}`)
          return <div className={classNames.join(' ')} onclick={clickTab.bind(null, attr.slice, i)}>
            {child.children}
          </div>
        })
      }
    </div>
    <div className="Tabs__tabPanel">
      {children.filter(child => child.element === 'TabPanel')[state.activeTabIndex].children}
    </div>
  </div>
}

function Tab (attr, children) {
  return {
    element: 'Tab',
    attr: attr,
    children: children
  }
}

function TabPanel (attr, children) {
  return {
    element: 'TabPanel',
    attr: attr,
    children: children
  }
}

function clickTab (slice, i) {
  Store.instance.dispatch({
    type: 'Tabs.clickTab',
    slice: slice,
    index: i
  })
}

class TabsReducer {
  constructor (slice) {
    this.slice = slice
  }

  reduce (state, action) {
    switch (action.type) {
      case 'Tabs.clickTab':
        if (action.slice !== this.slice) return state
        return Object.assign({}, state, {activeTabIndex: action.index})
      default:
        return state
    }
  }
}

TabsReducer.initState = {
  activeTabIndex: 0
}

export { Tab, TabPanel, Tabs, TabsReducer }
