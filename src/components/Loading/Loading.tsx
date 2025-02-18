import { Player } from '@lottiefiles/react-lottie-player'; // Ou use lottie-react se preferir
import styles from './Loading.module.css';
import loading from '../../assets/animations/Loadings/LoadingCompleto.json';

const Loading = () => {
  return (
    <div className={styles.loadingoverlay}>
      <Player
        autoplay
        loop
        src={loading} // Caminho para o JSON da animação
        style={{ height: '200px', width: '200px' }}
      />
    </div>
  );
};

export default Loading;
