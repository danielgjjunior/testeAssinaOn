import CryptoJS from "crypto-js";

const SECRET_KEY = "difsmosd123kAmffim854sdfsfd"; // Chave secreta compartilhada

export const decryptCodContrato = (encryptedCodContrato: string): string | null => {
    try {
        const bytes = CryptoJS.AES.decrypt(encryptedCodContrato, SECRET_KEY);
        return bytes.toString(CryptoJS.enc.Utf8);
    } catch (error) {
        console.error("Erro ao descriptografar o codcontrato:", error);
        return null;
    }
};

// Exemplo de uso no React
const getQueryParam = (param: string) => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get(param);
};

const encryptedCodContrato = getQueryParam("codcontrato");
const codcontrato = encryptedCodContrato
    ? decryptCodContrato(encryptedCodContrato)
    : null;

if (codcontrato) {
    console.log("Codcontrato descriptografado:", codcontrato);
} else {
    console.error("Codcontrato inválido ou não fornecido.");
}
