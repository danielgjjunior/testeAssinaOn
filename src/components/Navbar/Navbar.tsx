import { useState } from 'react';
import styles from './Navbar.module.css';
import { NavbarInterface } from '../../types';
import logo from '../../assets/img/logo/logoPadrao.png';
import { Menu, X } from 'lucide-react';
import { FaFileSignature } from "react-icons/fa";
import { MdEmail } from 'react-icons/md';

import LogoReduzida from '../../assets/img/logo/LogoReduzida.png';

import Divider from '@mui/material/Divider';
import { BiExit } from 'react-icons/bi';
import ShortcutCard from '../ShortcutCard/ShortcutCard';

export default function Navbar({ isCollapsed, onMenuClick, onToggleCollapse }: NavbarInterface) {
    const [selectedItem, setSelectedItem] = useState<string | null>('Assine');

    const handleMenuClick = (item: string) => {
        setSelectedItem(item);
        onMenuClick(item);
    };

    return (
        <div className={`${styles.NavbarMain} ${isCollapsed ? styles.collapsed : ''}`}>
            <div className={styles.LogoDiv}>
                <a href="https://www.onnetmais.com.br" target="_blank" rel="noopener noreferrer">
                    <img
                        src={isCollapsed ? LogoReduzida : logo}
                        alt="Logo"
                        className={`${styles.logo} ${isCollapsed ? styles.hidden : ''}`}
                    />
                </a>
                <a href="https://www.onnetmais.com.br" target="_blank" rel="noopener noreferrer">
                    <img src={LogoReduzida} alt="LogoReduzida" className={`${styles.logoReduzida} ${!isCollapsed ? styles.hidden : ''}`} />
                </a>
                {isCollapsed ? (
                    <X size={"2.2rem"} className={styles.menuIconCollapsed} onClick={() => onToggleCollapse(!isCollapsed)} />
                ) : (
                    <Menu size={"2.2rem"} className={styles.menuIcon} onClick={() => onToggleCollapse(!isCollapsed)} />
                )}
            </div>

            <div className={styles.menuOptions}>
                
            {!isCollapsed && <span className={styles.menuTitle}>Menu Principal</span>}

                <span
                    className={`${styles.menuItem} ${selectedItem === "Assine" ? styles.selected : ''}`}
                    onClick={() => handleMenuClick("Assine")}
                >
                    <div className={`${styles.iconWrapper} ${selectedItem === "Assine" ? styles.activeWrapper : ''}`}>
                        <FaFileSignature size={25} />
                    </div>
                    {!isCollapsed && <span>Assine seu contrato</span>}
                </span>

                <span
                    className={`${styles.menuItem} ${selectedItem === "Contato" ? styles.selected : ''}`}
                    onClick={() => handleMenuClick("Contato")}
                >
                    <div className={`${styles.iconWrapper} ${selectedItem === "Contato" ? styles.activeWrapper : ''}`}>
                        <MdEmail size={25} />
                    </div>
                    {!isCollapsed && <span>Contato</span>}
                </span>


                <Divider />

                {/* <span
                    className={`${styles.menuItem} ${selectedItem === "Settings" ? styles.selected : ''}`}
                    onClick={() => handleMenuClick("Settings")}
                >
                    <div className={`${styles.iconWrapper} ${selectedItem === "Settings" ? styles.activeWrapper : ''}`}>
                        <IoSettingsSharp size={25} />
                    </div>
                    {!isCollapsed && <span>Configurações</span>}
                </span> */}

            </div>

            <div className={`${styles.shortcutContainer} ${isCollapsed ? styles.collapsed : ''}`}>
                <ShortcutCard isCollapsed={isCollapsed} />
            </div>

            <a href="https://www.onnetmais.com.br" target="_blank" rel="noopener noreferrer">
                <span
                    className={`${styles.menuItem} ${selectedItem === "Leave" ? styles.leaveSelected : ''}`}
                    onClick={() => handleMenuClick("Leave")}
                >
                    <div className={`${styles.iconWrapper} ${selectedItem === "Leave" ? styles.leaveWrapper : ''}`}>
                        <BiExit color='red' size={25} />
                    </div>
                    {!isCollapsed && <span>Sair do Sistema</span>}
                </span>
            </a>
        </div>
    );
}
