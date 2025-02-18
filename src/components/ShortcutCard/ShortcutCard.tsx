import React from 'react';
import styles from './ShortcutCard.module.css';
import background from '../../assets/svg/shortcut.svg';
import dots from '../../assets/svg/dotsSquare.svg';
import { FaArrowRight } from 'react-icons/fa';
import appclientesLogo from '../../assets/img/logo/appclientesLogo.png'

interface ShortcutCardProps {
    isCollapsed: boolean;
}

const ShortcutCard: React.FC<ShortcutCardProps> = ({ isCollapsed }) => {
    if (isCollapsed) {
        // Quando colapsado, renderiza um link
        return (
            <a href="https://play.google.com/store/apps/details?id=br.com.mksolutions.mksac.onnet&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
                <div className={styles.collapsedShortcut}>
                    <img src={appclientesLogo} alt="Aplicativo Clientes" className={styles.appclientes} />
                </div>
            </a>
        );
    }

    // Renderiza o componente padrão quando expandido
    return (
        <a href="https://play.google.com/store/apps/details?id=br.com.mksolutions.mksac.onnet&pcampaignid=web_share" target="_blank" rel="noopener noreferrer">
            <div
                className={styles.ShortcutCard}
                style={{ backgroundImage: `url(${background})` }}
            >
                <img src={dots} alt="Dots" className={styles.dotsSquare} />

                <div className={styles.text}>
                    Baixe o aplicativo OnNet Clientes e descubra um mundo de possibilidades
                </div>
                <FaArrowRight size={25} className={styles.arrow} />
            </div>
        </a>
    );
};

export default ShortcutCard;
