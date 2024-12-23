import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";

import TaskBlockInput from "../TaskBlockInput/TaskBlockInput";
import TaskBlockDropDown from "../TaskBlockDropDown/TaskBlockDropDown";

import { saveTasks, loadTasks } from "../../services/storageService";

import "./TaskBlock.scss";

import addIcon from "../../assets/icons/add-icon.svg";
import closeIcon from "../../assets/icons/close-icon.svg";

type Task = {
  id: string;
  text: string;
  description?: string;
};

type TaskBlockProps = {
  title: string;
  items: Task[];
  setItems: React.Dispatch<React.SetStateAction<Task[]>>;
  dropdownItems?: Task[];
  setDropdownItems?: React.Dispatch<React.SetStateAction<Task[]>>;
  generateTaskId?: () => string;
  moveTask?: (
    task: Task,
    sourceSetter: React.Dispatch<React.SetStateAction<Task[]>>,
    targetSetter: React.Dispatch<React.SetStateAction<Task[]>>
  ) => void;
};

function TaskBlock({
  title,
  items,
  setItems,
  dropdownItems = [],
  setDropdownItems,
  generateTaskId,
}: TaskBlockProps): JSX.Element {
  const [inputValue, setInputValue] = useState<string>("");
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState<boolean>(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const taskBlockRef = useRef<HTMLDivElement | null>(null);

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(event.target.value);
  }

  function handleAddItem() {
    if (title === "Backlog" && inputValue.trim() && generateTaskId) {
      const newTask: Task = {
        id: generateTaskId(),
        text: inputValue,
        description: "",
      };
      setItems((prev) => [...prev, newTask]);
      setInputValue("");
    } else if (selectedTask) {
      if (setDropdownItems) {
        // Удаляем задачу из предыдущего блока в локальном состоянии
        setDropdownItems((prev) =>
          prev.filter((task) => task.id !== selectedTask.id)
        );

        // Удаляем задачу из localStorage
        const tasksData = loadTasks(); // Загружаем текущие данные из localStorage
        const updatedTasks = {
          ...tasksData,
          backlogItems: tasksData.backlogItems.filter(
            (task: any) => task.id !== selectedTask.id
          ),
          readyItems: tasksData.readyItems.filter(
            (task: any) => task.id !== selectedTask.id
          ),
          inProgressItems: tasksData.inProgressItems.filter(
            (task: any) => task.id !== selectedTask.id
          ),
          finishedItems: tasksData.finishedItems.filter(
            (task: any) => task.id !== selectedTask.id
          ),
        };

        saveTasks(updatedTasks); // Сохраняем изменения в localStorage
      }

      // Добавляем задачу в новый блок
      setItems((prev) => [...prev, selectedTask]);

      // Обновляем новый блок в localStorage
      const tasksData = loadTasks();
      const updatedTasks = {
        ...tasksData,
        [title.toLowerCase().replace(/\s/g, "") + "Items"]: [
          ...(tasksData[title.toLowerCase().replace(/\s/g, "") + "Items"] ||
            []),
          selectedTask,
        ],
      };

      saveTasks(updatedTasks);

      // Сбрасываем выбранную задачу
      setSelectedTask(null);
    }
  }

  function handleButtonClick() {
    if (title === "Backlog") {
      if (!isInputVisible) {
        setIsInputVisible(true);
      } else if (inputValue.trim()) {
        handleAddItem();
      }
    } else if (selectedTask) {
      handleAddItem();
    } else if (dropdownItems && dropdownItems.length > 0) {
      setIsDropdownVisible((prev) => !prev);
    }
  }

  function handleSelectDropdownItem(task: Task | null) {
    setSelectedTask(task);
  }

  useEffect(() => {
    const allTaskBlocks = Array.from(
      document.querySelectorAll(".task-block")
    ).filter(
      (block, index): block is HTMLDivElement =>
        index > 0 && block instanceof HTMLDivElement
    );

    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        const block = entry.target as HTMLDivElement;

        block.style.overflow = "visible"; // Устанавливаем overflow: visible
        if (block.clientHeight > 538) {
          block.style.overflow = "auto"; // Если высота больше 538px, устанавливаем overflow: auto
        }
      });
    });

    allTaskBlocks.forEach((block) => observer.observe(block));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="task-block" ref={taskBlockRef}>
      <p className="task-block__title">{title}</p>
      <ul className="task-block__list">
        {items.length === 0 ? (
          <li className="task-block__item task-block__item--empty">No tasks</li>
        ) : (
          items.map((item) => (
            <li key={item.id} className="task-block__item">
              <Link
                to={`/tasks/${item.id}`}
                state={{
                  taskId: item.id,
                  taskName: item.text,
                  taskDescription: item.description || "No description",
                }}
              >
                {item.text}
              </Link>
            </li>
          ))
        )}
      </ul>

      {title === "Backlog" && (
        <TaskBlockInput
          inputValue={inputValue}
          handleChange={handleChange}
          isInputVisible={isInputVisible}
        />
      )}

      {title !== "Backlog" && isDropdownVisible && dropdownItems && (
        <TaskBlockDropDown
          items={dropdownItems}
          onSelect={handleSelectDropdownItem}
          selectedTask={selectedTask}
        />
      )}

      <div className="task-block__controls">
        <button
          className={`${
            title === "Backlog"
              ? isInputVisible
                ? inputValue.trim()
                  ? "task-block__button task-block__button--disabled-submit"
                  : "task-block__button task-block__button--disabled"
                : "task-block__button"
              : dropdownItems.length > 0 || selectedTask
              ? "task-block__button"
              : "task-block__button task-block__button--disabled"
          } ${selectedTask ? "add-task" : ""}`}
          onClick={handleButtonClick}
          disabled={
            title !== "Backlog" && dropdownItems.length === 0 && !selectedTask
          }
        >
          <img
            src={
              title !== "Backlog" && isDropdownVisible && !selectedTask
                ? closeIcon
                : addIcon
            }
            alt={
              title !== "Backlog" && isDropdownVisible && !selectedTask
                ? "close-icon"
                : "add-icon"
            }
          />
          {title === "Backlog" && isInputVisible ? "Submit" : "Add card"}
        </button>
      </div>
    </div>
  );
}

export default TaskBlock;
