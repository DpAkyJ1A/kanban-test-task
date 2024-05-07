import { Button } from '@/components';
import styles from './index.module.css';
import { Header, Footer } from '@/layout';

export default function Home() {
  return (
    <div className={styles.homePage}>
      <Header />
      <main>
        <Button>KANBAN!</Button>
      </main>
      <Footer />
    </div>
  );
}
