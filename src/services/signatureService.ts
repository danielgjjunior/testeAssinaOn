import axios from "axios";

const API_URL = "https://app.onnettelecom.com.br/api/contracts/signature";

export const sendSignatureAndSelfie = async (
    contratoNumero: string | null,
    selfieBase64: string,
    assinaturaBase64: string,
    ipaddress: string // Adiciona o parâmetro ipAddress
): Promise<{ mensagem: string }> => {
    if (!contratoNumero) {
        throw new Error("Número do contrato é obrigatório.");
    }

    // Converter Base64 para Blob
    const base64ToBlob = (base64: string, contentType = "image/png"): Blob => {
        const byteCharacters = atob(base64.split(",")[1]); // Ignorar o prefixo 'data:image/png;base64,' 
        const byteArrays = [];
        for (let offset = 0; offset < byteCharacters.length; offset += 512) {
            const slice = byteCharacters.slice(offset, offset + 512);
            const byteNumbers = new Array(slice.length)
                .fill(0)
                .map((_, i) => slice.charCodeAt(i));
            byteArrays.push(new Uint8Array(byteNumbers));
        }
        return new Blob(byteArrays, { type: contentType });
    };

    // Gerar arquivos Blob
    const selfieBlob = base64ToBlob(selfieBase64);
    const assinaturaBlob = base64ToBlob(assinaturaBase64);

    const formData = new FormData();
    formData.append("selfie", new File([selfieBlob], "selfie.png"));
    formData.append("assinatura", new File([assinaturaBlob], "assinatura.png"));
    formData.append("ipaddress", ipaddress); 

    

    try {
        // Envia a requisição POST com FormData e o IP incluído no corpo
        const response = await axios.post(`${API_URL}?contrato=${contratoNumero}`, formData);
        return response.data;
    } catch (error: any) {
        throw new Error(
            `Erro ao enviar dados: ${error.response?.status || "desconhecido"} - ${error.message}`
        );
    }
};
