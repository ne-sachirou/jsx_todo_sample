import Task from '../models/Task'

export default class TaskListReducer {
  reduce (state, action) {
    switch (action.type) {
      case 'TaskList.clickTodoMark':
        {
          let i = action.index
          return Object.assign({}, state, {
            todo: [...state.todo.slice(0, i), ...state.todo.slice(i + 1)],
            done: Task.sort([state.todo[i], ...state.done])
          })
        }
      case 'TaskList.clickTodoEdit':
        {
          let i = action.index
          return Object.assign({}, state, {
            AddTaskForm: Object.assign({}, state.AddTaskForm, {
              priority: state.todo[i].priority,
              expression: state.todo[i].toString()
            }),
            todo: [...state.todo.slice(0, i), ...state.todo.slice(i + 1)]
          })
        }
      case 'TaskList.clickDoneMark':
        {
          let i = action.index
          return Object.assign({}, state, {
            todo: Task.sort([state.done[i], ...state.todo]),
            done: [...state.done.slice(0, i), ...state.done.slice(i + 1)]
          })
        }
      default:
        return state
    }
  }
}
