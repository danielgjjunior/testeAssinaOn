import axios from 'axios';

const API_BASE_URL = 'https://app.onnettelecom.com.br/api';

export const fetchDocuments = async (codcontrato: string) => {
  console.log(codcontrato)
  try {
    const response = await axios.get(`${API_BASE_URL}/contracts/documents`, {
      params: { codcontrato },
    });
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar documentos:', error);
    throw error;
  }
};
