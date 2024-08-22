import React, {useState} from 'react';
import {Box, Button, Container, Paper, TextField, Typography} from '@mui/material';

const Plitki2 = () => {
  const [width, setWidth] = useState<string>('');
  const [height, setHeight] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('');
  const [result, setResult] = useState<string | null>(null);

  const calculateArea = () => {
    const widthInMeters = parseFloat(width) / 100;
    const heightInMeters = parseFloat(height) / 100;
    const totalArea = widthInMeters * heightInMeters * parseInt(quantity, 10);
    setResult(totalArea.toFixed(2));
  };

  const clearFields = () => {
    setWidth('');
    setHeight('');
    setQuantity('');
    setResult(null);
  };

  const isFormValid = width !== '' && height !== '' && quantity !== '';

  return (
    <Container>
      <Box
        sx={{
          maxWidth: '100%',
          margin: 'auto',
          padding: 2,
          mt: '20px',
          mb: '20px',
          display: 'flex',
          alignItems: 'center',
        }}
        component={Paper}
      >
        <TextField
          label="Ширина (см)"
          type="number"
          value={width}
          onChange={(e) => setWidth(e.target.value)}
          required
          size="small"
          sx={{width: 100, mr: 1}}
        />
        <TextField
          label="Высота (см)"
          type="number"
          value={height}
          onChange={(e) => setHeight(e.target.value)}
          required
          size="small"
          sx={{width: 100, mr: 1}}
        />
        <TextField
          label="Количество штук"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          size="small"
          sx={{width: 120, mr: 1}}
        />
        <Button
          variant="outlined"
          color="error"
          onClick={clearFields}
          sx={{mr: 2}}
        >
          Очистить
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={calculateArea}
          disabled={!isFormValid}
          sx={{mr: 2}}
        >
          Посчитать
        </Button>
        {result && (
          <Typography variant="h6">
            Общая площадь: {result} м²
          </Typography>
        )}
      </Box>
    </Container>
  );
};

export default Plitki2;
