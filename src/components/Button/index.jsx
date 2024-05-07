import styles from './index.module.css'; // Подключаем файл стилей

const index = ({ children, className }) => {
  return <button className={`${styles.btn} ${className}`}>{children}</button>;
};

export default index;
