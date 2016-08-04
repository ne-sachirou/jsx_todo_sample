'use strict'
import virtualize from 'vdom-virtualize'
import {create, diff, patch} from 'virtual-dom'

if (!window.requestAnimationFrame) {
  window.requestAnimationFrame = function (callback) {
    window.setTimeout(callback, 10)
  }
}

export default class Renderer {
  constructor (holderNode, component) {
    this.holderNode = holderNode
    this.component = component
    this.shouldUpdate = false
  }

  prepare () {
    var tree
    const update = () => {
      const nextTree = this.component({}, [])
      patch(this.holderNode.lastChild, diff(tree, nextTree))
      tree = nextTree
    }
    if (this.holderNode.children.length === 0) {
      tree = this.component({}, [])
      this.holderNode.appendChild(create(tree))
    } else {
      tree = virtualize(this.holderNode.lastChild)
      update()
    }
    const loop = () => {
      if (this.shouldUpdate) {
        this.shouldUpdate = false
        update()
      }
      window.requestAnimationFrame(loop)
    }
    window.requestAnimationFrame(loop)
  }

  render () {
    this.shouldUpdate = true
  }
}
