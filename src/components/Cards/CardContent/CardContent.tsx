import { useEffect, useState } from 'react';
import { fetchDocuments } from '../../../services/documentsService';
import Card from '../Card/Card';
import styles from './CardContent.module.css';
import { useLoading } from '../../Loading/LoadingContext';
import { DocumentType } from '../../../types';
import { FaWhatsapp } from 'react-icons/fa';
import { Accordion, AccordionDetails, AccordionSummary, styled, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const CustomAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: '#f8f8f8',
  border: `1px solid ${theme.palette.divider}`,
  boxShadow: 'none',
  '&:before': {
    display: 'none',
  },
}));

// Estilizando o cabeçalho do Accordion
const CustomAccordionSummary = styled(AccordionSummary)(() => ({
  backgroundColor: '#f5f5f5', // Suaviza o contraste
  color: '#444', // Um tom mais neutro para melhor leitura
  fontWeight: 'bold',
  borderBottom: '1px solid rgba(0, 0, 0, .1)',
  '&:hover': {
    backgroundColor: '#ececec',
  },
}));


const CardContent = ({ codcontrato, address }: { codcontrato: string | null, address: string | null }) => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [pendingDocuments, setPendingDocuments] = useState<DocumentType[]>([]);
  const [signedDocuments, setSignedDocuments] = useState<DocumentType[]>([]);
  const { setIsLoading } = useLoading();


  const fetchData = async () => {
    if (!codcontrato) {
      console.error('Codcontrato não fornecido.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await fetchDocuments(codcontrato);

      // Separa os documentos pendentes e assinados
      const pending = data.filter((doc: DocumentType) => doc.STATUS === 'Pendente');
      const signed = data.filter((doc: DocumentType) => doc.STATUS !== 'Pendente');

      setPendingDocuments(pending);
      setDocuments(pending)
      setSignedDocuments(signed);
    } catch (error) {
      console.error('Erro ao buscar documentos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [codcontrato, setIsLoading]);

  return (
    <div className={styles.CardContentMain}>
      <CustomAccordion defaultExpanded >
        <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
          <span className={styles.title}>

            Documentos Pendentes de Assinatura
          </span>
        </CustomAccordionSummary>
        <AccordionDetails sx={{ marginTop: "30px", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "40px" }}>
          {pendingDocuments.length > 0 ? (
            pendingDocuments.map((doc) => (
              <Card
                key={doc["NÚMERO DOCUMENTO"]}
                allDocuments={documents}
                status={doc.STATUS}
                descricao={doc.DESCRIÇÃO}
                documento={doc.DOCUMENTO}
                numeroDocumento={doc["NÚMERO DOCUMENTO"]}
                dataEmissao={doc.emissao}
                dataAceite={doc["DATA DE ACEITE"]}
                contratoNumber={codcontrato}
                onModalClose={fetchData}
                address={address || ""}
              />
            ))
          ) : (
            <div className={styles.noDocuments}>
              <p>Não existem documentos pendentes de assinatura. Caso isso seja um erro, entre em contato com nossa equipe.</p>
              <a href="https://wa.me/seu-numero" target="_blank" rel="noopener noreferrer" className={styles.whatsappButton}>
                <FaWhatsapp size={20} /> Fale conosco
              </a>
            </div>
          )}
        </AccordionDetails>
      </CustomAccordion>

      {signedDocuments.length > 0 && (
        <CustomAccordion defaultExpanded={pendingDocuments.length !== 0}>
          <CustomAccordionSummary expandIcon={<ExpandMoreIcon />}>
            <span className={styles.title}>
              Documentos Anteriores
            </span>
          </CustomAccordionSummary>
          <AccordionDetails sx={{ marginTop: "30px", marginBottom: "40px", display: "flex", alignItems: "center", justifyContent: "center", flexWrap: "wrap", gap: "40px" }}>
            {signedDocuments.length > 0 ? (
              signedDocuments.map((doc) => (
                <Card
                  key={doc["NÚMERO DOCUMENTO"]}
                  allDocuments={documents}
                  status={doc.STATUS}
                  descricao={doc.DESCRIÇÃO}
                  documento={doc.DOCUMENTO}
                  numeroDocumento={doc["NÚMERO DOCUMENTO"]}
                  dataEmissao={doc.emissao}
                  dataAceite={doc["DATA DE ACEITE"]}
                  contratoNumber={codcontrato}
                  onModalClose={fetchData}
                  address={address || ""}
                />
              ))
            ) : (
              <Typography variant="body1">Nenhum documento assinado encontrado.</Typography>
            )}
          </AccordionDetails>
        </CustomAccordion>
      )}

    </div>
  );
};

export default CardContent;
