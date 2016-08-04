import Renderer from './lib/Renderer'
import Store from './lib/Store'
import {TabsReducer} from './lib/Tabs.jsx'
import Todo from './components/Todo.jsx'
import AddTaskFormReducer from './reducers/AddTaskFormReducer'
import TaskListReducer from './reducers/TaskListReducer'

const store = new Store({
  AddTaskForm: {
    expression: '',
    errors: []
  },
  todo: [],
  done: [],
  TodoTabs: TabsReducer.initState
}, [
  new AddTaskFormReducer(),
  new TaskListReducer(),
  new TabsReducer('TodoTabs')
])

window.startApp = function startApp () {
  var renderer = new Renderer(document.getElementById('Todo'), Todo)
  renderer.prepare()
  store.renderers.push(renderer)
}

window.addEventListener('DOMContentLoaded', () => startApp())
