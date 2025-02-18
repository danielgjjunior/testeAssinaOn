
import Avatar from '../Avatar/Avatar';
import styles from './Header.module.css';
import { useMediaQuery } from '../useMediaQuery.tsx/useMediaQuery';
import logo from '../../assets/img/logo/logoPadrao.png';

export interface HeaderInterface {
    nomeCliente: string | null;
}

export default function Header(props: HeaderInterface) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <div className={styles.headerMain}>
            <div className={styles.identificationContainer}>
                <Avatar name={props.nomeCliente || 'Não informado'} />
                <div className={styles.nameDiv}>
                    {props.nomeCliente || 'Não informado'}
                </div>
            </div>
            <div className={styles.greetings}>
                <span>Seja bem-vindo</span>
            </div>
            {isMobile && (
                <a href="https://www.onnetmais.com.br" target="_blank" rel="noopener noreferrer" style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
                    <img src={logo} alt="Logo" className={styles.logo} />
                </a>
            )}
        </div>
    );
}
