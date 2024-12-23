import { useState, useEffect } from "react";

import "./TaskBlockDropDown.scss";
import dropDownArrow from "../../assets/icons/dropdown-arrow.svg";

type Task = {
  id: string;
  text: string;
};

type TaskBlockDropDownProps = {
  items: Task[];
  onSelect: (task: Task | null) => void;
  selectedTask: Task | null;
};

function TaskBlockDropDown({
  items,
  onSelect,
  selectedTask,
}: TaskBlockDropDownProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [availableItems, setAvailableItems] = useState<Task[]>(items);

  // Синхронизация доступных задач с обновлённым списком
  useEffect(() => {
    setAvailableItems(items);
  }, [items]);

  // Закрытие меню, если нет задач
  useEffect(() => {
    if (availableItems.length === 0) {
      setIsOpen(false); // Закрываем меню, если задач больше нет
    }
  }, [availableItems]);

  // Открытие/закрытие дропдауна
  function toggleDropDown() {
    if (availableItems.length === 0) {
      setIsOpen(false); // Закрываем меню, если задач больше нет
      return;
    }
    setIsOpen((prev) => !prev);
  }

  // Обработка выбора задачи
  function handleSelect(item: Task, e: React.MouseEvent) {
    e.stopPropagation();
    if (selectedTask) {
      // Возвращаем текущую выбранную задачу в список
      setAvailableItems((prevItems) => [...prevItems, selectedTask]);
    }

    setAvailableItems((prevItems) => prevItems.filter((i) => i.id !== item.id));
    onSelect(item);

    // Закрываем меню
    setIsOpen(false);
  }

  return (
    <div
      className={`task-block__dropdown task-block__item ${
        selectedTask ? "task-block__dropdown--with-empty" : ""
      }`}
      onClick={toggleDropDown}
    >
      {/* Отображение выбранной задачи */}
      {selectedTask && (
        <div className="task-block__item--selected">
          <span>{selectedTask.text}</span>
        </div>
      )}
      {/* Изображение стрелки */}
      <img
        src={dropDownArrow}
        className={`task-block__dropdown-arrow ${
          isOpen ? "task-block__dropdown-arrow--active" : ""
        }`}
        alt="dropdown-arrow"
      />
      {/* Выпадающий список */}
      {isOpen && availableItems.length > 0 && (
        <ul className="task-block__dropdown-list">
          {availableItems.map((item) => (
            <li
              key={item.id}
              className="task-block__dropdown-item"
              onClick={(e) => handleSelect(item, e)}
            >
              {item.text}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TaskBlockDropDown;
