import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import { loadTasks } from "../services/storageService";

import "./TaskDescriptionPage.scss";

import taskCloseBtn from "../assets/icons/task-close-button-icon.svg";

type Task = {
  id: string;
  text: string;
  description?: string;
};

type TaskDescriptionPageProps = {
  updateTask: (updatedTask: Task) => void;
};

function TaskDescriptionPage({
  updateTask,
}: TaskDescriptionPageProps): JSX.Element {
  const location = useLocation();
  const navigate = useNavigate();

  const taskId = location.state?.taskId;
  const taskName = location.state?.taskName || "Unknown Task";

  const [description, setDescription] = useState("");

  useEffect(() => {
    const tasksData = loadTasks();

    const findTaskById = (id: string) =>
      [
        ...tasksData.backlogItems,
        ...tasksData.readyItems,
        ...tasksData.inProgressItems,
        ...tasksData.finishedItems,
      ].find((task: Task) => task.id === id);

    const task = findTaskById(taskId);
    if (task) {
      setDescription(task.description || "");
    }
  }, [taskId]);

  const handleClose = () => {
    const updatedTask = { id: taskId, text: taskName, description };
    updateTask(updatedTask); // Обновляем задачу в состоянии App
    navigate("/");
  };

  return (
    <div className="task-description-wrapper">
      <div className="task-description-container">
        <div className="task-description-container__task-name">{taskName}</div>
        <div className="task-description-container__task-close-button">
          <button onClick={handleClose} className="task-close-button">
            <img src={taskCloseBtn} alt="task-close-button" />
          </button>
        </div>
        <div className="task-description-container__task-area">
          <textarea
            placeholder="This task has no description."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            autoComplete="off"
          ></textarea>
        </div>
      </div>
    </div>
  );
}

export default TaskDescriptionPage;
