import "./Footer.scss";

type FooterProps = {
  activeTasks: number;
  finishedTasks: number;
};

function Footer({ activeTasks, finishedTasks }: FooterProps): JSX.Element {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__number-tasks">Active tasks: {activeTasks}</div>
        <div className="footer__number-tasks">
          Finished tasks: {finishedTasks}
        </div>
        <div className="footer__number-tasks">
          Kanban board by {"<NAME>"}, {"<YEAR>"}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
