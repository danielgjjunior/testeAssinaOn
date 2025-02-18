export interface NavbarInterface {
    onMenuClick: (menuOption: string) => void;
    onToggleCollapse: (isCollapsed: boolean) => void;
    isCollapsed: boolean;
}
export interface DocumentType {
    "NÚMERO DOCUMENTO": number;
    CLIENTE: string;
    DESCRIÇÃO: string;
    DOCUMENTO: string;
    STATUS: string;
    emissao: string;
    "PROTOCOLO ACEITE": string | null;
    "DATA DE ACEITE": string | null;
    "ORIGEM DO ACEITE": string | null;
}
