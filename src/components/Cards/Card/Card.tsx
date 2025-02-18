import { useState } from 'react';
import styles from './Card.module.css';
import contratoImagem from '../../../assets/img/modeloContrato.png';
import { FaMapLocationDot, FaPrint } from 'react-icons/fa6';
import { BsFillCalendarDateFill } from 'react-icons/bs';
import { FaEye, FaSignature } from 'react-icons/fa';
import DocumentViewer from '../../Modal/DocumentViewer';
import { showToastWarning } from '../../Toastify/Toastify';
import SignatureModal from '../../Modal/SignatureModal/SignatureModal';
import { DocumentType } from '../../../types';

interface CardProps {
    status: string;
    descricao: string;
    numeroDocumento: number;
    dataEmissao: string;
    dataAceite: string | null;
    documento: string; // HTML puro do backend
    contratoNumber: string | null;
    allDocuments: DocumentType[];
    address:string;
    onModalClose: () => void; // Adiciona a prop para o callback
}

const Card = ({ status, contratoNumber, descricao, numeroDocumento, dataEmissao, dataAceite, documento, allDocuments, address, onModalClose }: CardProps) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);

    const getStatusClass = () => {
        switch (status) {
            case 'Pendente':
                return styles.statusPendente;
            case 'Aceito':
                return styles.statusAceito;
            default:
                return styles.statusDefault;
        }
    };

    const handleVisualizarClick = () => {
        setIsModalOpen(true);
        showToastWarning("Lembramos que para uma experiência completa, seu contrato também está disponível no app OnNet Clientes.");
    };

    const handleAssinarClick = () => {
        setIsSignatureModalOpen(true);
    };

    const handleSignatureModalClose = () => {
        setIsSignatureModalOpen(false);
        onModalClose(); // Chama o callback para atualizar os documentos
    };


    const handlePrint = () => {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
            printWindow.document.write(`
                <html>
                    <head>
                        <title>Imprimir Contrato</title>
                        <style>
                            body { font-family: Arial, sans-serif; padding: 20px; }
                            h1 { color: #333; }
                            .content { margin-top: 20px; }
                        </style>
                    </head>
                    <body>
                        <h1>${descricao}</h1>
                        <div class="content">${documento}</div>
                        <script>window.onload = () => { window.print(); }</script>
                    </body>
                </html>
            `);
            printWindow.document.close();
        }
    };

    return (
        <>
            <div className={styles.CardContainer}>


                <div className={styles.upperDiv}>
                    <button className={styles.printIcon} onClick={handlePrint} title="Imprimir Contrato">
                        <FaPrint size={20} />
                    </button>
                    <div
                        className={styles.contractPreview}
                        style={{ backgroundImage: `url(${contratoImagem})` }}
                    >
                        <div className={`${styles.statusDiv} ${getStatusClass()}`}>{status}</div>
                    </div>
                    <div className={styles.contractName}>{descricao}</div>
                </div>

                <div className={styles.downDiv}>
                    <div className={styles.infoDiv}>
                        <span className={styles.contractNumber}>Doc n°: {numeroDocumento}</span>
                        <span className={styles.acceptanceDate}>
                            Aceite em: {dataAceite ? new Date(dataAceite).toLocaleDateString() : 'Pendente'}
                        </span>
                    </div>
                    <div className={styles.extraInfoContainer}>
                        <div className={styles.documentDate}>
                            <span className={styles.IconContainer}>
                                <BsFillCalendarDateFill size={20} color="#01B3FF" />
                            </span>
                            <div className={styles.documentData}>
                                <span className={styles.infoContainerTitle}>Data do documento</span>
                                <span className={styles.infoContainerContent}>
                                    {new Date(dataEmissao).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                        <div className={styles.Address}>
                            <div className={styles.documentDate}>
                                <span className={styles.IconContainer}>
                                    <FaMapLocationDot size={20} color="#01B3FF" />
                                </span>
                                <div className={styles.documentData}>
                                    <span className={styles.infoContainerTitle}>Endereço</span>
                                    <span className={styles.infoContainerContent}>
                                        {address}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.visualizarButton} onClick={handleVisualizarClick}>
                            <FaEye size={16} style={{ marginRight: '8px' }} />
                            Visualizar
                        </button>
                        {status === 'Pendente' && (
                            <button className={styles.assineButton} onClick={handleAssinarClick}>
                                <FaSignature size={16} style={{ marginRight: '8px' }} />
                                Assinar
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <DocumentViewer
                    onClose={() => setIsModalOpen(false)}
                    documentoHtml={documento}
                    title={descricao}
                />
            )}
            {isSignatureModalOpen && (
                <SignatureModal
                    contratoNumero={contratoNumber}

                    onClose={handleSignatureModalClose}
                    allDocuments={allDocuments}
                />
            )}
        </>
    );
};

export default Card;
