const STORAGE_KEY = "tasks";

// Загрузка данных из localStorage
export const loadTasks = (): any => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data
    ? JSON.parse(data)
    : {
        backlogItems: [],
        readyItems: [],
        inProgressItems: [],
        finishedItems: [],
        taskIdCounter: 1,
      };
};

// Сохранение данных в localStorage
export const saveTasks = (tasks: any): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
};
