import { useState, useEffect, useId } from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import TaskBlock from "./components/TaskBlock/TaskBlock";
import TaskDescriptionPage from "./pages/TaskDescriptionPage";
import Footer from "./components/Footer/Footer";

import { loadTasks, saveTasks } from "./services/storageService";

import "./styles/main.scss";

type Task = {
  id: string;
  text: string;
  description?: string;
};

function App(): JSX.Element {
  const [backlogItems, setBacklogItems] = useState<Task[]>([]);
  const [readyItems, setReadyItems] = useState<Task[]>([]);
  const [inProgressItems, setInProgressItems] = useState<Task[]>([]);
  const [finishedItems, setFinishedItems] = useState<Task[]>([]);

  const uniqueId = useId();

  useEffect(() => {
    const savedData = loadTasks();
    setBacklogItems(savedData.backlogItems || []);
    setReadyItems(savedData.readyItems || []);
    setInProgressItems(savedData.inProgressItems || []);
    setFinishedItems(savedData.finishedItems || []);
  }, []);

  function mergeTaskListsWithLocalStorage(): void {
    const savedData = loadTasks();

    const mergeTasks = (newTasks: Task[], existingTasks: Task[]): Task[] => {
      const taskMap = new Map(existingTasks.map((task) => [task.id, task]));
      newTasks.forEach((task) => {
        const existingTask = taskMap.get(task.id);
        if (existingTask) {
          taskMap.set(task.id, { ...existingTask, ...task });
        } else {
          taskMap.set(task.id, task);
        }
      });
      return Array.from(taskMap.values());
    };

    const mergedData = {
      backlogItems: mergeTasks(backlogItems, savedData.backlogItems),
      readyItems: mergeTasks(readyItems, savedData.readyItems),
      inProgressItems: mergeTasks(inProgressItems, savedData.inProgressItems),
      finishedItems: mergeTasks(finishedItems, savedData.finishedItems),
    };

    saveTasks(mergedData);
  }

  useEffect(() => {
    mergeTaskListsWithLocalStorage();
  }, [backlogItems, readyItems, inProgressItems, finishedItems]);

  function generateTaskId(): string {
    return `${uniqueId}-${Date.now()}`;
  }

  function updateTask(updatedTask: Task) {
    const updateList = (list: Task[]) =>
      list.map((task) =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      );

    setBacklogItems((prev) => updateList(prev));
    setReadyItems((prev) => updateList(prev));
    setInProgressItems((prev) => updateList(prev));
    setFinishedItems((prev) => updateList(prev));

    const tasksData = loadTasks();
    const updatedTasks = {
      backlogItems: updateList(tasksData.backlogItems || []),
      readyItems: updateList(tasksData.readyItems || []),
      inProgressItems: updateList(tasksData.inProgressItems || []),
      finishedItems: updateList(tasksData.finishedItems || []),
    };
    saveTasks(updatedTasks);
  }

  return (
    <Router>
      <Header />
      <main className="main">
        <Routes>
          <Route
            path="/"
            element={
              <div className="container">
                <TaskBlock
                  title="Backlog"
                  items={backlogItems}
                  setItems={setBacklogItems}
                  generateTaskId={generateTaskId}
                />
                <TaskBlock
                  title="Ready"
                  items={readyItems}
                  setItems={setReadyItems}
                  dropdownItems={backlogItems}
                  setDropdownItems={setBacklogItems}
                />
                <TaskBlock
                  title="In Progress"
                  items={inProgressItems}
                  setItems={setInProgressItems}
                  dropdownItems={readyItems}
                  setDropdownItems={setReadyItems}
                />
                <TaskBlock
                  title="Finished"
                  items={finishedItems}
                  setItems={setFinishedItems}
                  dropdownItems={inProgressItems}
                  setDropdownItems={setInProgressItems}
                />
              </div>
            }
          />
          <Route
            path="/tasks/:id"
            element={<TaskDescriptionPage updateTask={updateTask} />}
          />
        </Routes>
      </main>
      <Footer
        activeTasks={backlogItems.length}
        finishedTasks={finishedItems.length}
      />
    </Router>
  );
}

export default App;
