'use strict'

export default function Changeset (model) {
  return class Changeset {
    constructor (data, changes) {
      this.data = data
      this.changes = changes
      this.errors = model.props.reduce((errors, propName) => Object.assign(errors, {[propName]: []}), {})
    }

    validate () {
      if (model.props.reduce((errorNum, propName) => errorNum + this.errors[propName].length, 0) > 0) {
        const err = new Error('ValidationError')
        err.changeset = this
        throw err
      }
    }
  }
}
