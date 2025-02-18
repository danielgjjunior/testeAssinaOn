import { FaTableList } from 'react-icons/fa6';
import { HiSquares2X2 } from 'react-icons/hi2';
import { useEffect, useState } from 'react';
import styles from './ContractsAvailable.module.css';
import CardContent from '../Cards/CardContent/CardContent';
import { decryptCodContrato } from '../../services/decrypt';
import { Navigate } from 'react-router-dom';
import TableContent from '../Table/DocumentsTable';
import { Player } from '@lottiefiles/react-lottie-player';
import loading from '../../../src/assets/animations/Loadings/LoadinMini.json';

const ContractsAvailable = () => {
    const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
    const [redirectTo404, setRedirectTo404] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [codcontrato, setCodContrato] = useState<string | null>(null);
    const [endereco, setEndereco] = useState<string | null>(null);

    const handleClickSelection = (view: 'card' | 'table') => {
        setViewMode(view);
    };

    useEffect(() => {
        const fetchContractData = async () => {
            const codCriptografado = new URLSearchParams(location.search).get('codcontrato');
            const enderecoCliente = new URLSearchParams(location.search).get('address');

            if (!codCriptografado) {
                setRedirectTo404(true);
                setErrorMessage("Código do contrato não encontrado.");
                setIsLoading(false);
                return;
            }

            const decryptedCod = decryptCodContrato(codCriptografado);
            if (!decryptedCod) {
                setRedirectTo404(true);
                setErrorMessage("Código do contrato inválido.");
                setIsLoading(false);
                return;
            }

            localStorage.setItem('codcontrato', decryptedCod);
            if (enderecoCliente) {
                localStorage.setItem('endereco', enderecoCliente);
                setEndereco(enderecoCliente);
            }

            setCodContrato(decryptedCod);
            setIsLoading(false);
        };

        fetchContractData();
    }, []);

    if (redirectTo404) {
        return <Navigate to="/404" state={{ message: errorMessage }} />;
    }


    return (
        <div className={styles.ContractsAvailableMain}>
            <div className={styles.upperContracts}>
                <div className={styles.titleDiv}>
                    <div className={styles.mainTitleContainer}>
                        <span className={styles.title}>Contrato de número:</span>
                        <div className={styles.contractDiv}>
                            <span className={styles.numberContract}>{codcontrato}</span>
                        </div>
                    </div>
                    <div className={styles.subtitle}>
                        Visualize e assine seus contratos
                    </div>
                </div>
                <div className={styles.contractActions}>
                    <div className={styles.filterOfContracts}>
                        <div
                            className={`${styles.filter} ${viewMode === 'card' ? styles.activeFilter : ''}`}
                            onClick={() => handleClickSelection('card')}
                        >
                            <HiSquares2X2 className={styles.filterIcon} />
                        </div>

                        <div
                            className={`${styles.filter} ${viewMode === 'table' ? styles.activeFilter : ''}`}
                            onClick={() => handleClickSelection('table')}
                        >
                            <FaTableList className={styles.filterIcon} />
                        </div>
                    </div>
                </div>
            </div>
            {isLoading ? (
                <>
                    <p>Carregando</p>
                    <Player autoplay loop src={loading} style={{ height: '200px', width: '200px' }} />
                </>
            ) : (
                <div className={styles.contractsContainer}>
                    {viewMode === 'card' ? (
                        <CardContent codcontrato={codcontrato} address={endereco} />
                    ) : (
                        <TableContent codcontrato={codcontrato} address={endereco} />
                        // <div></div>
                    )}
                </div>
            )}
            {/* {isMobile && (
                <button className={styles.assineButtonMobile}>
                    <FaSignature size={25} style={{ marginRight: '10px' }} />Assinar todos
                </button>
            )} */}
        </div>
    );
};

export default ContractsAvailable;
