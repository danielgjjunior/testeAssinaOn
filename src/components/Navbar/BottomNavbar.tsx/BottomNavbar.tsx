import { useState, useEffect } from "react";
import styles from "./BottomNavbar.module.css";

import { CiMail } from "react-icons/ci";
import { LiaFileSignatureSolid } from "react-icons/lia";

interface BottomNavbarProps {
  onMenuClick: (item: string) => void;
}

export default function BottomNavbar({ onMenuClick }: BottomNavbarProps) {
  const [selected, setSelected] = useState("Assine");

  const handleMenuClick = (item: string) => {
    setSelected(item);
    onMenuClick(item);
  };

  // Redirecionamento automático para o WhatsApp quando "Contato" for selecionado
  useEffect(() => {
    if (selected === "Contato") {
      const phoneNumber = "553492492222"; // Substitua pelo número desejado
      const whatsappURL = `https://wa.me/${phoneNumber}`;
      window.location.href = whatsappURL; // Redireciona automaticamente para a página do WhatsApp
    }
  }, [selected]);

  return (
    <div className={styles.BottomNavbar}>
      <span
        onClick={() => handleMenuClick("Assine")}
        className={`${styles.navItem} ${selected === "Assine" ? styles.selected : ""}`}
      >
        <LiaFileSignatureSolid size={24} className={selected === "Assine" ? styles.selectedIcon : ""} />
        {selected === "Assine" && <span className={styles.menuTitle}>Documentos para assinar</span>}
      </span>
      <span
        onClick={() => handleMenuClick("Contato")}
        className={`${styles.navItem} ${selected === "Contato" ? styles.selected : ""}`}
      >
        <CiMail size={24} className={selected === "Contato" ? styles.selectedIcon : ""} />
        {selected === "Contato" && <span className={styles.menuTitle}>Contato</span>}
      </span>
      {/* <span
        onClick={() => handleMenuClick("Settings")}
        className={`${styles.navItem} ${selected === "Settings" ? styles.selected : ""}`}
      >
        <IoSettingsOutline size={24} className={selected === "Settings" ? styles.selectedIcon : ""} />
        {selected === "Settings" && <span className={styles.menuTitle}>Configurações</span>}
      </span> */}
    </div>
  );
}
