import "./TaskBlockInput.scss";

type TaskBlockInputProps = {
  inputValue: string;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  isInputVisible: boolean;
};

function TaskBlockInput({
  inputValue,
  handleChange,
  isInputVisible,
}: TaskBlockInputProps): JSX.Element {
  return (
    <div
      className={`task-block__input task-block__item ${
        isInputVisible ? "" : "task-block__input--hidden"
      }`}
    >
      <input
        type="text"
        className={`task-block__input--active ${
          inputValue.length > 0 ? "task-block__input--has-text" : ""
        }`}
        value={inputValue}
        onChange={handleChange}
        placeholder="Enter text..."
      />
    </div>
  );
}

export default TaskBlockInput;
