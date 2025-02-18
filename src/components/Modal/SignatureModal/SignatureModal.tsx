import React, { useState, useRef, useEffect } from 'react';
import SignatureCanvas from 'react-signature-canvas';
import Webcam from 'react-webcam';
import styles from './SignatureModal.module.css';
import { FaArrowLeft, FaArrowRight,  FaCheckCircle, FaEdit, FaRegTimesCircle } from 'react-icons/fa';
import { FcSelfie, FcServices, FcSmartphoneTablet } from "react-icons/fc";
import contratoAssinaturaIlustracao1 from '../../../assets/img/contractSteps/contratoAssinaturaIlustracao.jpg';
import contratoAssinaturaIlustracao2 from '../../../assets/img/contractSteps/contratoAssinaturaIlustracao2.jpg';
import contratoAssinaturaIlustracao3 from '../../../assets/img/contractSteps/contratoAssinaturaIlustracao3.png';
import { DocumentType } from '../../../types';
import DocumentViewer from '../DocumentViewer';
import assinaturaExemplo from '../../../assets/mp4/digitalSignature.mp4';
import ImageCropper from '../../ImageCropper/ImageCropper';
import { Player } from '@lottiefiles/react-lottie-player';
import loading from '../../../assets/animations/Loadings/LoadingCompleto.json';
import { sendSignatureAndSelfie } from '../../../services/signatureService';
import { showToastError, showToastSuccess } from '../../Toastify/Toastify';
import Confetti from 'react-confetti';
import { useMediaQuery } from '../../useMediaQuery.tsx/useMediaQuery';

// Array de imagens correspondentes a cada etapa
const stepImages = [
    contratoAssinaturaIlustracao1,
    contratoAssinaturaIlustracao2,
    contratoAssinaturaIlustracao3,
    contratoAssinaturaIlustracao3,
];

interface SignatureModalProps {
    onClose: () => void;
    contratoNumero: string | null;
    allDocuments: DocumentType[];
}

const SignatureModal = ({ onClose, contratoNumero, allDocuments }: SignatureModalProps) => {
    const [step, setStep] = useState(1);
    const [isTermsAccepted, setIsTermsAccepted] = useState(false);
    const signaturePadRef = useRef<SignatureCanvas | null>(null);
    const [signatureData, setSignatureData] = useState<string | null>(null);
    const [isCanvasEmpty, setIsCanvasEmpty] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState<{
        descricao: string;
        documento: string;
    } | null>(null);

    const [isSignaturePanelOpen, setIsSignaturePanelOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [croppedImage, setCroppedImage] = useState<string | null>(null);
    const [isCropping, setIsCropping] = useState(false);
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [statusMessage, setStatusMessage] = useState<string | null>(null);
    const [isFeedbackModalVisible, setIsFeedbackModalVisible] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [showConfetti, setShowConfetti] = useState(false);
    const [ipaddress, setIpAddress] = useState(''); useEffect(() => { const fetchIp = async () => { try { const response = await fetch('https://api.ipify.org?format=json'); const data = await response.json(); setIpAddress(data.ip); } catch (error) { console.error(error); } }; fetchIp(); }, []);

    const webcamRef = useRef<Webcam | null>(null);
    const isMobile = useMediaQuery('(max-width: 768px)');
    const [cameraMobile,setCameraMobile] = useState(false)
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const capturePhoto = () => {
        if (webcamRef.current) {
            const imageData = webcamRef.current.getScreenshot();
            if (imageData) {
                setCapturedImage(imageData);
                setIsCameraOpen(false);
            }
        }
    };

    // Função para capturar foto no celular
    const handleMobileCapture = (event: any) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setCapturedImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    // Função para forçar clique no input de arquivo escondido
    const openMobileCamera = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };



    useEffect(() => {
        // Detecta se o dispositivo é mobile
        setCameraMobile(/Mobi|Android|iPhone/i.test(navigator.userAgent));
        console.log(cameraMobile)
        console.log(isMobile)
    }, []);


    const handleOpenDocument = (doc: any) => {
        setSelectedDocument({
            descricao: doc.DESCRIÇÃO,
            documento: doc.DOCUMENTO,
        });
        setIsModalOpen(true);
    };

    const handleCropComplete = (croppedBlob: Blob | null) => {
        if (croppedBlob) {
            const croppedURL = URL.createObjectURL(croppedBlob);

            // Libera o URL antigo, se houver
            if (croppedImage) {
                URL.revokeObjectURL(croppedImage);
            }

            setCroppedImage(croppedURL);
            setCapturedImage(croppedURL); // Atualiza a imagem capturada com a cortada
        }
        setIsCropping(false);
    };

    const handleNextStep = () => setStep((prev) => prev + 1);
    const handlePreviousStep = () => setStep((prev) => prev - 1);

    const handleTermsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setIsTermsAccepted(event.target.checked);
    };

    const handleSaveSignature = () => {
        if (signaturePadRef.current && !isCanvasEmpty) {
            const signatureImage = signaturePadRef.current.getTrimmedCanvas().toDataURL('image/png');
            setSignatureData(signatureImage);
            setIsSignaturePanelOpen(false);
        }
    };

    const handleClearSignature = () => {
        if (signaturePadRef.current) {
            signaturePadRef.current.clear();
            setIsCanvasEmpty(true);
        }
    };

    const handleOpenSignaturePanel = () => {
        setIsSignaturePanelOpen(true);
    };

    const handleSignatureChange = () => {
        if (signaturePadRef.current) {
            setIsCanvasEmpty(signaturePadRef.current.isEmpty());
        }

    };
    const handleCompleteSigning = async () => {
        if (!signatureData || !capturedImage) {
            showToastError("Por favor, preencha todos os campos antes de concluir.");
            return;
        }

        setIsLoading(true);
        setStatusMessage("Aguarde enquanto finalizamos sua assinatura...");
        setIsFeedbackModalVisible(true);

        try {
            // Incluindo o IP no envio para o backend
            const response = await sendSignatureAndSelfie(contratoNumero, capturedImage, signatureData, ipaddress);

            const responseData = response; // Objeto completo retornado pela função
            const { mensagem } = responseData;
            setStatusMessage(mensagem);
            setIsSuccess(true);
            setShowConfetti(true);

            showToastSuccess(mensagem);
        } catch (error: any) {
            const errorMessage = error.response?.data?.mensagem || "Erro desconhecido ao assinar o contrato.";
            setStatusMessage(errorMessage);
            setIsSuccess(false);
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(()=>{
console.log(allDocuments)
    })


    const handleCloseFeedbackModal = () => {
        setIsFeedbackModalVisible(false);
        setIsSuccess(false);
        setShowConfetti(false);
        onClose()
    };

    const stepData: Record<number, { title: string; icon: JSX.Element }> = {
        1: { title: 'Vamos assinar seus documentos', icon: <span>🖊️</span> },
        2: { title: 'Termos de Serviço', icon: <FcServices /> },
        3: { title: 'Assinatura Digital', icon: <FcSmartphoneTablet /> },
        4: { title: 'Foto com Documento', icon: <FcSelfie /> }
    };

    
    return (
        <div className={styles.modalOverlay}>
            <div className={step === 4 ? styles.modalContent4 : styles.modalContent}>
                {step !== 4 && (
                    <div className={styles.ilustrator} style={{ backgroundImage: `url(${stepImages[step - 1]})` }}>
                        {step !== 1 && (

                            <div className={styles.closeButton} onClick={onClose}>
                                Fechar <FaRegTimesCircle size={20} />
                            </div>
                        )

                        }

                    </div>
                )}


                <div className={styles.header}>

                    <span className={styles.modalTitle}>
                        {stepData[step]?.title} {stepData[step]?.icon}
                    </span>
                </div>



                {step === 1 && (
                    <div className={styles.stepContent}>

                        <p>Seu contrato de número <strong>{contratoNumero}</strong> possui alguns documentos pendentes de assinatura. Revise-os e quando estiver pronto, clique em continuar.</p>
                        <div className={styles.docsList}>
                            {allDocuments
                                .filter((doc) => doc.STATUS === "Pendente")
                                .map((doc) => (
                                    <div
                                        className={styles.docName}
                                        key={doc["NÚMERO DOCUMENTO"]}
                                        onClick={() => handleOpenDocument(doc)} // Abre o modal ao clicar
                                        style={{ cursor: 'pointer' }} // Estiliza como um link clicável
                                    >
                                        {doc.DESCRIÇÃO}
                                    </div>
                                ))
                            }
                        </div>

                        <div className={styles.buttonContainer}>

                            <button className={styles.cancelButton} onClick={onClose}>Cancelar <FaRegTimesCircle /></button>
                            <button className={styles.nextButton} onClick={handleNextStep}>Avançar <FaArrowRight /></button>
                        </div>
                    </div>
                )}

                {step === 2 && (
                    <div className={styles.stepContent}>
                        <p className={styles.title}>Ao assinar esse contrato digitalmente, você concorda com os termos nele estabelecidos?</p>
                        <p className={styles.subtitle}>Caso tenha alguma dúvida, fique a vontade para retornar a etapa anterior e ler os termos presentes nos documentos novamente.</p>


                        <div className={styles.termsCheckbox}>
                            <input
                                type="checkbox"
                                checked={isTermsAccepted}
                                onChange={handleTermsChange}
                                id="terms"
                                className={styles.customCheckbox}
                            />
                            <label htmlFor="terms" className={styles.customLabel}>Aceito os Termos e Condições</label>
                        </div>

                        <div className={styles.buttonContainer}>
                            <button className={styles.backButton} onClick={handlePreviousStep}> <FaArrowLeft /> Voltar </button>

                            <button className={isTermsAccepted ? styles.nextButton : styles.buttonDisabled} onClick={handleNextStep} disabled={!isTermsAccepted} >Avançar <FaArrowRight /></button>
                        </div>
                    </div>
                )}


                {step === 3 && (
                    <div className={styles.stepContent}>
                        {!signatureData ? (
                            <div className={styles.upperInfo}>
                                <p>Chegou a hora de assinarmos o contrato. Clique no botão abaixo para abrir o painel de assinatura.</p>
                                <video src={assinaturaExemplo} autoPlay loop className={styles.assinaturaVideo}></video>
                                <button className={styles.signaturePadButton} onClick={handleOpenSignaturePanel}>
                                    Abrir Painel de Assinatura
                                </button>
                            </div>
                        ) : (
                            <>
                                <p>Ótimo. Agora que concluiu a assinatura, estamos prontos para avançar. Caso deseje Editar sua assinatura, basta clicar no lápis abaixo.</p>
                                <img src={signatureData} alt="Assinatura" className={styles.signaturePreview} />
                                <button className={styles.editButton} onClick={handleOpenSignaturePanel}>
                                    <FaEdit /> Editar Assinatura
                                </button>
                            </>
                        )}

                        <div className={styles.buttonContainer}>
                            <button className={styles.backButton} onClick={handlePreviousStep}> <FaArrowLeft /> Voltar </button>
                            <button
                                className={!signatureData ? styles.buttonDisabled : styles.nextButton}
                                onClick={handleNextStep}
                                disabled={!signatureData}
                            >
                                Avançar <FaArrowRight />
                            </button>
                        </div>
                    </div>
                )}

                {isSignaturePanelOpen && (
                    <div className={styles.signaturePanel}>
                        <div className={styles.signatureCanvasContainer}>
                            <SignatureCanvas
                                ref={signaturePadRef}
                                penColor="black"
                                onEnd={handleSignatureChange}
                                canvasProps={{
                                    className: styles.signatureCanvas,
                                    style: {
                                        width: '98%',
                                    },
                                }}
                            />
                        </div>
                        <div className={styles.signatureControls}>
                            <button className={styles.clearButton} onClick={handleClearSignature}>
                                Limpar
                            </button>
                            <button className={isCanvasEmpty ? styles.buttonDisabled : styles.saveButton} onClick={handleSaveSignature}
                                disabled={isCanvasEmpty}>
                                Salvar
                            </button>
                            <button className={styles.backButton} onClick={handlePreviousStep}> <FaArrowLeft /> Voltar </button>
                        </div>
                    </div>
                )}

            {step === 4 && (
                <div className={styles.stepContent4}>
                    {!isCameraOpen ? (
                        <div className={styles.stepContent4}>
                            <p>Para concluir sua assinatura de contrato, será necessário capturar uma foto sua. Segure seu documento com o lado da frente (Lado da foto) virado para a câmera. Quando estiver pronto, capture a imagem.</p>

                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className={styles.nextButton}
                            >
                                Abrir Câmera
                            </button>

                            {cameraMobile && (
                                <input
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleMobileCapture}
                                    style={{ display: "none" }}
                                    id="mobileCamera"
                                />
                            )}
                        </div>
                    ) : !capturedImage ? (
                        cameraMobile ? (
                            <button onClick={openMobileCamera} className={styles.nextButton}>
                                Tirar Foto
                            </button>
                        ) : (
                            <div className={styles.cameraModal}>
                                <Webcam
                                    audio={false}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                    className={styles.cameraPreview}
                                />
                                <div className={styles.cameraButtons}>
                                    <button onClick={capturePhoto} className={styles.captureButton}>
                                        Capturar Foto
                                    </button>
                                    <button onClick={() => setIsCameraOpen(false)} className={styles.cancelButton}>
                                        Fechar Câmera
                                    </button>
                                </div>
                            </div>
                        )
                    ) : (
                        <>
                            <img
                                src={capturedImage}
                                alt="Imagem Capturada"
                                className={styles.previewImage}
                            />
                            <div className={styles.buttonContainer}>
                                <button onClick={() => setCapturedImage(null)} className={styles.editButton}>
                                    Capturar Nova Imagem
                                </button>
                            </div>
                        </>
                    )}
                    <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    capture="user"
    onChange={handleMobileCapture}
    style={{ display: "none" }}
/>
                    <div className={styles.buttonContainer}>
                        <button className={styles.backButton} onClick={handlePreviousStep}> <FaArrowLeft /> Voltar </button>
                        <button
                            className={!capturedImage ? styles.buttonDisabled : styles.saveButton}
                            onClick={handleCompleteSigning}
                            disabled={step < 4 || !capturedImage}
                        >
                            Concluir Assinatura <FaCheckCircle />
                        </button>
                    </div>
                </div>
            )}
        </div>
    
            {isFeedbackModalVisible && (
                <div className={styles.feedbackModal}>
                    <div className={styles.feedbackContent}>
                        {isLoading ? (
                            <>
                                <p>{statusMessage}</p>
                                <Player
                                    autoplay
                                    loop
                                    src={loading} // Caminho para o JSON da animação
                                    style={{ height: '200px', width: '200px' }}
                                />
                            </>
                        ) : (
                            <>
                                <p>{statusMessage}</p>
                                {isSuccess ? (
                                    <FaCheckCircle className={styles.successIcon} />
                                ) : (
                                    <FaRegTimesCircle className={styles.errorIcon} />
                                )}
                                <button onClick={handleCloseFeedbackModal} className={styles.closeButton}>
                                    Fechar
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
            {showConfetti && <Confetti />}


            {isCropping && capturedImage && (
                <ImageCropper
                    imageSrc={capturedImage}
                    aspect={4 / 3}
                    onCropComplete={handleCropComplete}
                    onClose={() => setIsCropping(false)}
                />
            )}


            {isModalOpen && selectedDocument && (
                <DocumentViewer
                    onClose={() => setIsModalOpen(false)}
                    documentoHtml={selectedDocument.documento}
                    title={selectedDocument.descricao}
                />
            )}
        </div>
    );
};

export default SignatureModal;
