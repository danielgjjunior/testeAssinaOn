import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Collapse,
  Box,
} from "@mui/material";
import { FaEye, FaPrint, FaSignature } from "react-icons/fa";
import { KeyboardArrowDown, KeyboardArrowUp } from "@mui/icons-material";
import styles from "./DocumentsTable.module.css";
import { useLoading } from "../Loading/LoadingContext";
import { fetchDocuments } from "../../services/documentsService";
import DocumentViewer from "../Modal/DocumentViewer";
import SignatureModal from "../Modal/SignatureModal/SignatureModal";

interface DocumentType {
  "NÚMERO DOCUMENTO": string;
  CLIENTE: string;
  DESCRIÇÃO: string;
  STATUS: string;
  "PROTOCOLO ACEITE"?: string;
  "DATA DE ACEITE"?: string | null;
  DOCUMENTO: string;
  emissao: string;
  "ORIGEM DO ACEITE": string;
}

const Row = ({ doc, handleVisualizarClick, handleAssinarClick, handlePrint }: any) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow className={styles.tableRow}>
        <TableCell>
          <IconButton onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
          </IconButton>
        </TableCell>
        <TableCell className={styles.tableCell}>{doc.DESCRIÇÃO}</TableCell>
        <TableCell>
          <div
            className={`${styles.statusDiv} ${
              doc.STATUS === "Pendente" ? styles.statusPendente : styles.statusAceito
            }`}
          >
            {doc.STATUS}
          </div>
        </TableCell>
        <TableCell className={styles.tableCell}>
          <IconButton onClick={() => handleVisualizarClick(doc)} title="Visualizar">
            <FaEye color="#007bff" />
          </IconButton>
          {doc.STATUS === "Pendente" && (
            <IconButton onClick={() => handleAssinarClick(doc)} title="Assinar">
              <FaSignature color="#28a745" />
            </IconButton>
          )}
          <IconButton onClick={() => handlePrint(doc)} title="Imprimir">
            <FaPrint color="#6c757d" />
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box margin={1}>
              <Table size="small">
                <TableBody>
                  <TableRow>
                    <TableCell><strong>Data Emissão:</strong></TableCell>
                    <TableCell>{new Date(doc.emissao).toLocaleDateString()}</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell><strong>Data Aceite:</strong></TableCell>
                    <TableCell>{doc["DATA DE ACEITE"] ? new Date(doc["DATA DE ACEITE"]).toLocaleDateString() : "Pendente"}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TableContent = ({ codcontrato, address }: { codcontrato: string | null; address: string | null }) => {
  const [documents, setDocuments] = useState<DocumentType[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<DocumentType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSignatureModalOpen, setIsSignatureModalOpen] = useState(false);
  const { setIsLoading } = useLoading();

  const fetchData = async () => {
    if (!codcontrato) {
      console.error("Codcontrato não fornecido.");
      return;
    }
    setIsLoading(true);
    try {
      const data = await fetchDocuments(codcontrato);
      const formattedData: DocumentType[] = data.map((doc: any) => ({
        "NÚMERO DOCUMENTO": doc["NÚMERO DOCUMENTO"] || "",
        CLIENTE: doc.CLIENTE || "",
        DESCRIÇÃO: doc.DESCRIÇÃO || "",
        STATUS: doc.STATUS || "",
        "PROTOCOLO ACEITE": doc["PROTOCOLO ACEITE"] || "",
        "DATA DE ACEITE": doc["DATA DE ACEITE"] || null,
        DOCUMENTO: doc.DOCUMENTO || "",
        emissao: doc.emissao || "",
        "ORIGEM DO ACEITE": doc["ORIGEM DO ACEITE"] || "Desconhecido",
        address: address,
      }));
      setDocuments(formattedData);
    } catch (error) {
      console.error("Erro ao buscar documentos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [codcontrato, setIsLoading]);

  return (
    <TableContainer component={Paper} className={styles.tableContainer}>
      <Table>
        <TableHead>
          <TableRow className={styles.tableHeader}>
            <TableCell />
            <TableCell>Documento</TableCell>
            <TableCell>Status</TableCell>
            <TableCell>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <Row key={doc["NÚMERO DOCUMENTO"]} doc={doc} handleVisualizarClick={() => setSelectedDoc(doc)} handleAssinarClick={() => setSelectedDoc(doc)} handlePrint={() => console.log("Printing", doc)} />
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableContent;
