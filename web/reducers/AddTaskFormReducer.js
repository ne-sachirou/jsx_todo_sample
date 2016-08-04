import Task from '../models/Task'

export default class AddTaskFormReducer {
  reduce (state, action) {
    switch (action.type) {
      case 'AddTaskForm.changeExpression':
        return this._assignAddTaskForm(state, {expression: action.expression})
      case 'AddTaskForm.persist':
        {
          let changeset = new Task.Changeset(new Task(), Task.fromStringExpression(state.AddTaskForm.expression))
          try {
            changeset.validate()
          } catch (err) {
            return this._assignAddTaskForm(state, {
              errors: [].concat(...Object.keys(err.changeset.errors).map(prop => err.changeset.errors[prop]))
            })
          }
          new Task.Repository().persist(changeset)
          state = this._assignAddTaskForm(state, {expression: '', errors: []})
          return Object.assign({}, state, {todo: Task.sort([changeset.data, ...state.todo])})
        }
      default:
        return state
    }
  }

  _assignAddTaskForm (state, diff) {
    return Object.assign({}, state, {
      AddTaskForm: Object.assign({}, state.AddTaskForm, diff)
    })
  }
}
