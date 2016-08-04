import {h} from 'virtual-dom'
import Store from '../lib/Store'

export default function AddTaskForm () {
  var state = Store.instance.state.AddTaskForm
  return <form className="AddTaskForm">
    <div>
      <div contentEditable={true} className="AddTaskForm__input" onblur={changeExpression}>{state.expression}</div>
      <button onclick={persist}>Add</button>
    </div>
    <ul className="AddTaskForm__errors">
      {state.errors.map(error => <li>{error}</li>)}
    </ul>
  </form>
}

function changeExpression (evt) {
  Store.instance.dispatch({
    type: 'AddTaskForm.changeExpression',
    expression: evt.target.textContent
  })
}

function persist (evt) {
  evt.preventDefault()
  Store.instance.dispatch({
    type: 'AddTaskForm.persist'
  })
}
