import styles from './NotFound.module.css';

const NotFoundPage = () => {
  return (
    <main className={styles.main}>
      <section className={styles.home}>
        <div className={styles.homeContainer}>
          <div className={styles.homeData}>
            <p className={styles.homeSubtitle}>Erro 404</p>
            <p className={styles.homeTitle}>Ops!</p>
            <p className={styles.homeDescription}>
              Parece que não conseguimos encontrar a página <br /> que você está procurando. <br /> Por favor, entre em contato com nossa equipe para que possamos ajudá-lo.
            </p>
            <a href="/" className={styles.homeButton}>
              Whatsapp
            </a>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
