import {h} from 'virtual-dom'
import {Tab, TabPanel, Tabs} from '../lib/Tabs.jsx'
import AddTaskForm from './AddTaskForm.jsx'
import TaskList from './TaskList.jsx'

export default function Todo () {
  return <div className="Todo">
    <Tabs slice="TodoTabs">
      <Tab>Tasks</Tab>
      <Tab>Todo.txt</Tab>
      <TabPanel>
        <AddTaskForm/>
        <TaskList/>
      </TabPanel>
      <TabPanel>
        Todo.txt
      </TabPanel>
    </Tabs>
  </div>
}
