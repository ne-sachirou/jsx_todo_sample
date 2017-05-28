'use strict'
import Changeset from '../lib/Changeset'

var _repo = {
  task_id_seq: 0,
  todo: [],
  done: []
}

export default class Task {
  constructor (props = {}) {
    this.id = props.id
    this.is_done = props.is_done || false
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
  props: ['is_done', 'priority', 'created_at', 'title', 'contexts', 'projects']
}

Task.Repository = class TaskRepository {
  find (id) {
    return _repo.todo.first(task => task.id === id)
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
        changes.id = ++_repo.task_id_seq
        _repo.todo.push(new Task(changes))
        break
      case 'update':
        {
          let task = _repo.todo.first(task => task.id === changeset.data.id)
          for (let prop of Object.keys(changes)) {
            task[prop] = changes[prop]
          }
          break
        }
    }
    changeset.data = Object.assign(new Task(), changeset.data, changes)
    changeset.changes = {}
    return changeset
  }

  destroy (id) {
    _repo.todo = _repo.todo.filter(task => task.id !== id)
  }
}

Task.Changeset = class TaskChangeset extends Changeset(Task.Model) {
  validate () {
    if (this.changes.title !== void 0 && this.changes.title === '') this.errors.title.push('Title is empty.')
    super.validate()
  }
}
