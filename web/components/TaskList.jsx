import {h} from 'virtual-dom'
import Store from '../lib/Store'

export default function TaskList () {
  var state = Store.instance.state
  return <div className="TaskList">
    <div>
      <div>Todo</div>
      <ol>
        {
          state.todo.map((task, i) =>
            <li>
              <span className="TaskList__todoMark" onclick={clickTodoMark.bind(null, i)}>□</span>
              <span className="TaskList__todoLabel"> {task.toString()} </span>
              <span className="TaskList__todoEdit" onclick={clickTodoEdit.bind(null, i)}>✎</span>
            </li>
          )
        }
      </ol>
    </div>
    <div>
      <div>Done</div>
      <ol>
        {
          state.done.map((task, i) =>
            <li>
              <span className="TaskList__doneMark" onclick={clickDoneMark.bind(null, i)}>✓</span>
              <span className="TaskList__doneLabel"> {task.toString()} </span>
            </li>
          )
        }
      </ol>
    </div>
  </div>
}

function clickTodoMark (i) {
  Store.instance.dispatch({
    type: 'TaskList.clickTodoMark',
    index: i
  })
}

function clickTodoEdit (i) {
  Store.instance.dispatch({
    type: 'TaskList.clickTodoEdit',
    index: i
  })
}

function clickDoneMark (i) {
  Store.instance.dispatch({
    type: 'TaskList.clickDoneMark',
    index: i
  })
}
