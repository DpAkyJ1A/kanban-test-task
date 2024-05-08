import { useEffect, useState } from 'react';
import styles from './index.module.css';
import { Header, Footer } from '@/layout';
import { boardsData } from '@/utils/constants/boardsData';
import generateUniqueId from '@/utils/helpers/generateUniqueId';

export default function Home() {
  const [boards, setBoards] = useState([]);
  const [currentBoard, setCurrentBoard] = useState(null);
  const [currentTask, setCurrentTask] = useState(null);
  const [addTaskIndex, setAddTaskIndex] = useState(null);
  const [textAreaContent, setTextAreaContent] = useState('');

  useEffect(() => {
    const storedBoards = JSON.parse(localStorage.getItem('boards'));
    if (storedBoards) {
      setBoards(storedBoards);
    } else {
      setBoards(boardsData);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('boards', JSON.stringify(boards));
  }, [boards]);

  function dragOverHandler(e) {
    e.preventDefault();
    if (e.target.className === 'task') {
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

  function addTaskHandler(e, i) {
    e.stopPropagation();
    if (textAreaContent.length === 0) return;

    const newTask = {
      id: generateUniqueId(),
      title: textAreaContent,
      description: textAreaContent,
      assignee: 'anon',
      dueDate: new Date(),
    };
    const newBoard = Object.assign({}, boards[i]);
    newBoard.tasks.push(newTask);

    setAddTaskIndex(null);
    setTextAreaContent('');
    setBoards(
      boards.map((board, j) => {
        if (i === j) {
          return newBoard;
        }
        return board;
      })
    );
  }

  return (
    <div
      className={styles.homePage}
      onClick={(e) => {
        if (!e.target.closest(`.${styles.board}`)) {
          setAddTaskIndex(null);
        }
      }}
    >
      <Header />
      <main className={styles.main}>
        <h2>Kanban board</h2>
        <div className={styles.workspace}>
          {boards.map((boardData, i) => (
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

              <div
                className={styles.board__addTaskContainer}
                onClick={(e) => {
                  if (e.target.closest(`.${styles.board}`)) {
                    setAddTaskIndex(i);
                  }
                }}
              >
                {addTaskIndex === i ? (
                  <div className={styles.board__addTask}>
                    <textarea
                      value={textAreaContent}
                      onChange={(e) => setTextAreaContent(e.target.value)}
                      placeholder="Enter your task here"
                    />
                    <div className={styles.row}>
                      <button
                        className={styles.addButton}
                        onClick={(e) => addTaskHandler(e, i)}
                      >
                        Add task
                      </button>
                      <button
                        className={styles.crossButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAddTaskIndex(null);
                        }}
                      >
                        <span>+</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <button className={styles.board__addTaskButton}>
                    <span>+</span> Add task
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
