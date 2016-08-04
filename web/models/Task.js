'use strict'

var _repo = {
  task: []
}

export default class Task {
  constructor (props = {}) {
    this.id = props.id
    this.priority = props.priority || null
    this.created_at = props.created_at || null
    this.title = props.title
    this.contexts = props.contexts || []
    this.projects = props.projects || []
  }

  toString () {
    var elements = []
    if (this.priority) elements.push(`(${this.priority})`)
    if (this.created_at) elements.push(this.created_at)
    elements.push(this.title)
    elements = elements.concat(this.contexts.map(context => `+${context}`))
    elements = elements.concat(this.projects.map(project => `@${project}`))
    return elements.join(' ')
  }
}

Task.fromStringExpression = function (expression) {
  var task = new Task()
  var match
  match = expression.match(/^\([A-Z]\)\s*/i)
  if (match) {
    task.priority = match[0][1].toUpperCase()
    expression = expression.slice(match[0].length)
  }
  match = expression.match(/^(\d{4}-\d\d-\d\d)\s+/)
  if (match) {
    let parsed = Date.parse(match[1])
    task.created_at = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate())
    expression = expression.slice(match[0].length)
  }
  {
    let regex
    regex = /\s?\+(\S+)\s?/g
    while ((match = regex.exec(expression)) !== null) task.contexts.push(match[1])
    regex = /\s?@(\S+)\s?/g
    while ((match = regex.exec(expression)) !== null) task.projects.push(match[1])
    expression = expression.replace(/[+@]\S+\s?/, '')
  }
  task.title = expression
  return task
}

Task.sort = function (tasks) {
  return tasks.sort((left, right) => {
    if (left.priority && !right.priority) return -1
    if (!left.priority && right.priority) return 1
    if (!left.priority && !right.priority) return 0
    if (left.priority < right.priority) return -1
    if (left.priority > right.priority) return 1
    if (left.priority === right.priority) return 0
  })
}

Task.Model = {
  keys: ['id'],
  props: ['priority', 'created_at', 'title', 'contexts', 'projects']
}

Task.Repository = class TaskRepository {
  find (id) {
    return _repo.task[id - 1]
  }

  persist (changeset) {
    const action = Task.Model.keys.some(key => changeset.data[key] == null) ? 'create' : 'update'
    const changes = Task.Model.props.reduce(
      (changes, prop) => {
        if (changeset.changes[prop] !== void 0 && changeset.data[prop] !== changeset.changes[prop]) {
          changes[prop] = changeset.changes[prop]
        }
        return changes
      },
      {}
    )
    switch (action) {
      case 'create':
        changes.id = _repo.task.length
        _repo.task[changes.id] = new Task(changes)
        break
      case 'update':
        for (let prop of Object.keys(changes)) {
          _repo.task[changeset.data.id][prop] = changes[prop]
        }
        break
    }
    changeset.data = Object.assign(new Task(), changeset.data, changes)
    changeset.changes = {}
    return changeset
  }

  destroy (id) {
    _repo.task.splice(id - 1, 1)
  }
}

Task.Changeset = class TackChangeset {
  constructor (data, changes) {
    this.data = data
    this.changes = changes
    this.errors = {
      priority: [],
      title: [],
      contexts: [],
      projects: []
    }
  }

  validate () {
    if (this.changes.title !== void 0 && this.changes.title === '') this.errors.title.push('Title is empty.')
    const errorNum = Object.keys(this.errors).reduce(
      (errorNum, propName) => errorNum + this.errors[propName].length,
      0
    )
    if (errorNum > 0) {
      const err = new Error('ValidationError')
      err.changeset = this
      throw err
    }
  }
}
