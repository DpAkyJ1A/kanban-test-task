import { useState } from 'react';
import styles from './index.module.css';
import { Header, Footer } from '@/layout';

const boardsData = [
  {
    id: 1,
    title: 'Open',
    tasks: [
      {
        id: 1,
        title: 'Task 1',
        description: 'Lorem ipsum dolor sit amet',
        assignee: 'Alice',
        dueDate: new Date(2023, 3, 10),
      },
      {
        id: 4,
        title: 'Task 4',
        description: 'Ut enim ad minim veniam',
        assignee: 'Alice',
        dueDate: new Date(2023, 3, 20),
      },
      {
        id: 6,
        title: 'Task 6',
        description: 'Excepteur sint occaecat cupidatat non proident',
        assignee: 'Eva',
        dueDate: new Date(2023, 4, 5),
      },
    ],
  },
  {
    id: 2,
    title: 'In progress',
    tasks: [
      {
        id: 2,
        title: 'Task 2',
        description: 'Consectetur adipiscing elit',
        assignee: 'Bob',
        dueDate: new Date(2023, 3, 15),
      },
      {
        id: 5,
        title: 'Task 5',
        description: 'Duis aute irure dolor in reprehenderit',
        assignee: 'Dave',
        dueDate: new Date(2023, 3, 27),
      },
      {
        id: 7,
        title: 'Task 7',
        description: 'Sunt in culpa qui officia deserunt mollit',
        assignee: 'Frank',
        dueDate: new Date(2023, 4, 8),
      },
    ],
  },
  {
    id: 3,
    title: 'Completed',
    tasks: [
      {
        id: 3,
        title: 'Task 3',
        description: 'Sed do eiusmod tempor incididunt',
        assignee: 'Charlie',
        dueDate: new Date(2023, 3, 18),
      },
      {
        id: 8,
        title: 'Task 8',
        description: 'Excepteur sint occaecat cupidatat non proident',
        assignee: 'Grace',
        dueDate: new Date(2023, 4, 12),
      },
      {
        id: 11,
        title: 'Task 11',
        description: 'Adipiscing elit, sed do eiusmod tempor incididunt',
        assignee: 'Isaac',
        dueDate: new Date(2023, 2, 5),
      },
    ],
  },
];

export default function Home() {
  const [boards, setBoards] = useState(boardsData);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);

  function dragOverHandler(e) {
    e.preventDefault();
    if (e.target.className == 'task') {
      e.target.style.opacity = 0.4;
      e.target.style.color = '#22272b';
    }
  }
  function dragLeaveHandler(e) {
    e.target.style.opacity = 1;
    e.target.style.color = '#b6c2cf';
  }
  function dragStartHandler(e, boardData, taskData) {
    setCurrentBoard(boardData);
    setCurrentTask(taskData);
  }
  function dragEndHandler(e) {
    e.target.style.opacity = 1;
    e.target.style.color = '#b6c2cf';
  }
  function dropHandler(e, boardData, taskData) {
    e.stopPropagation();
    e.preventDefault();
    e.target.style.opacity = 1;
    e.target.style.color = '#b6c2cf';
    const currentIndex = currentBoard.tasks.indexOf(currentTask);
    currentBoard.tasks.splice(currentIndex, 1);
    const dropIndex = boardData.tasks.indexOf(taskData);
    boardData.tasks.splice(dropIndex + 1, 0, currentTask);
    setBoards(
      boards.map((board) => {
        if (board.id === boardData.id) {
          return boardData;
        }
        if (board.id === currentBoard.id) {
          return currentBoard;
        }
        return board;
      })
    );
  }
  function dropTaskHandler(e, boardData) {
    e.stopPropagation();
    boardData.tasks.push(currentTask);
    const currentIndex = currentBoard.tasks.indexOf(currentTask);
    currentBoard.tasks.splice(currentIndex, 1);
    setBoards(
      boards.map((board) => {
        if (board.id === boardData.id) {
          return boardData;
        }
        if (board.id === currentBoard.id) {
          return currentBoard;
        }
        return board;
      })
    );
  }

  return (
    <div className={styles.homePage}>
      <Header />
      <main>
        <div className={styles.workspace}>
          {boards.map((boardData) => (
            <div
              key={boardData.title}
              className={styles.board}
              onDragOver={(e) => dragOverHandler(e)}
              onDrop={(e) => dropTaskHandler(e, boardData)}
            >
              <div className={styles.board__header}>
                <h3 className={styles.board__title}>{boardData.title}</h3>
              </div>
              <ol className={styles.board__taskList}>
                {boardData.tasks.map((taskData) => (
                  <li
                    key={taskData.title}
                    className="task"
                    draggable={true}
                    onDragOver={(e) => dragOverHandler(e)}
                    onDragLeave={(e) => dragLeaveHandler(e)}
                    onDragStart={(e) =>
                      dragStartHandler(e, boardData, taskData)
                    }
                    onDragEnd={(e) => dragEndHandler(e)}
                    onDrop={(e) => dropHandler(e, boardData, taskData)}
                  >
                    {taskData.title}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
