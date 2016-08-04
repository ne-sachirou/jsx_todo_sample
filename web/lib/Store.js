'use strict'
export default class Store {
  constructor (state, reducers) {
    if (Store.instance) return Store.instance
    Store.instance = this
    this.state = state
    this.reducers = reducers
    this.renderers = []
  }

  dispatch (action) {
    var state = this.state
    for (let reducer of this.reducers) {
      if (reducer.slice) {
        state = Object.assign({}, state, {
          [reducer.slice]: reducer.reduce(state[reducer.slice], action)
        })
      } else {
        state = reducer.reduce(state, action)
      }
    }
    this.state = state
    for (let renderer of this.renderers) renderer.render()
  }
}

Store.instance = null
