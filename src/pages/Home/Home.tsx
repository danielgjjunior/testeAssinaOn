import { useState, useEffect } from "react";
import styles from './Home.module.css';
import Navbar from "../../components/Navbar/Navbar";
import Header from "../../components/Header/Header";
import ContractsAvailable from "../../components/ContractsAvailable/ContractsAvailable";
import BottomNavbar from "../../components/Navbar/BottomNavbar.tsx/BottomNavbar";
import { useMediaQuery } from "../../components/useMediaQuery.tsx/useMediaQuery";

export default function Home() {
  const [selectedComponent, setSelectedComponent] = useState("Assine");
  const [isNavbarCollapsed, setNavbarCollapsed] = useState(false);

  const isMobile = useMediaQuery('(max-width: 768px)');

  const toggleNavbar = (collapsed: boolean) => {
    setNavbarCollapsed(collapsed);
  };

  const getQueryParam = (param: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
  };

  const nomeCliente = getQueryParam('nomeCliente');

  useEffect(() => {
    if (selectedComponent === "Contato") {
      const phoneNumber = "553492492222"; // Substitua pelo número desejado
      const whatsappURL = `https://wa.me/${phoneNumber}`;
      window.location.href = whatsappURL; // Redireciona automaticamente para a página do WhatsApp
    }
  }, [selectedComponent]);

  return (
    <div className={styles.HomeMain}>
      {!isMobile && (
        <div
          className={
            !isNavbarCollapsed ? `${styles.leftDiv}` : `${styles.leftDivCollapsed}`
          }
          style={{ width: isNavbarCollapsed ? "80px" : "18rem" }}
        >
          <Navbar
            isCollapsed={isNavbarCollapsed}
            onMenuClick={setSelectedComponent}
            onToggleCollapse={toggleNavbar}
          />
        </div>
      )}
      <div className={styles.rightDiv} style={{marginLeft: isNavbarCollapsed ? "0px" : "18rem"}}>
        <div className={styles.HeaderContainer}>
          <Header nomeCliente={nomeCliente} />
        </div>
        <div className={styles.activeContainer}>
          {selectedComponent === "Assine" && <ContractsAvailable />}
          {selectedComponent === "Contato" && (
            <div>
              
            </div>
          )}
        </div>
      </div>
      {isMobile && <BottomNavbar onMenuClick={setSelectedComponent} />}
    </div>
  );
}
