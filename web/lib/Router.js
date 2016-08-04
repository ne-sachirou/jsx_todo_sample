'use strict'
export default class Router {
  constructor () {
    this.routes = []
    window.addEventListener('popstate', (evt) => {
      this._load(window.location.pathname, evt.state)
    })
  }

  route (pattern, action) {
    this.routes.push({
      pattern: pattern,
      action: action
    })
  }

  assign (path, state = null) {
    window.history.pushState(state, null, path)
    this._load(path, state)
  }

  _load (path, state) {
    for (let {pattern, action} of this.routes) {
      let match = path.match(pattern)
      if (match) {
        action(match, state)
        break
      }
    }
  }
}
