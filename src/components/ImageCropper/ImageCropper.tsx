// ImageCropper.tsx
import React, { useState, useCallback } from 'react';
import Cropper, { Area } from 'react-easy-crop';
import { Slider, Button, Box, Typography, Paper } from '@mui/material';
import { getCroppedImg } from './ImageCropperHelper';


interface ImageCropperProps {
  imageSrc: string;
  aspect: number;
  onCropComplete: (croppedImage: Blob | null) => void;
  onClose: () => void;
}

const ImageCropper: React.FC<ImageCropperProps> = ({ imageSrc, aspect, onCropComplete, onClose }) => {
  const [crop, setCrop] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handleCropComplete = useCallback(
    async (_: Area, croppedAreaPixels: Area) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    []
  );

  const handleConfirmCrop = useCallback(async () => {
    if (croppedAreaPixels) {
      const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedImage);
    }
  }, [croppedAreaPixels, imageSrc, onCropComplete]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      width="100%"
      height="100vh"
      bgcolor="rgba(0, 0, 0, 0.5)"
      position="fixed"
      top={0}
      left={0}
      zIndex={1000}
    >
      <Paper elevation={3} style={{ padding: '20px', maxWidth: '600px', width: '90%', borderRadius: '8px' }}>
        <Typography variant="h6" align="center" gutterBottom>
          Ajuste sua Imagem
        </Typography>
        <Box position="relative" width="100%" height="400px">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={handleCropComplete}
            style={{ containerStyle: { borderRadius: '8px', overflow: 'hidden' } }}
          />
        </Box>
        <Box mt={2}>
          <Typography gutterBottom>Ajustar Zoom</Typography>
          <Slider
            value={zoom}
            min={1}
            max={3}
            step={0.1}
            onChange={(_e, zoomValue) => setZoom(zoomValue as number)}
            aria-labelledby="Zoom"
            sx={{
              color: 'primary.main',
              '& .MuiSlider-thumb': {
                height: 24,
                width: 24,
                '&:hover': {
                  boxShadow: 'inherit',
                },
              },
            }}
          />
        </Box>
        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="contained" color="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="contained" color="primary" onClick={handleConfirmCrop}>
            Confirmar
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default ImageCropper;
