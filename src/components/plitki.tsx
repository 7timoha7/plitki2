import React, {useState} from 'react';
import {PlitkiType} from "../type";
import {plitkiMass} from "../constans";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField
} from '@mui/material';


const Plitki = () => {
  const [quantities, setQuantities] = useState<{ [key: number]: string }>({});
  const [results, setResults] = useState<{ [key: number]: { packs: number, pieces: number } }>({});
  const [dialogInfo, setDialogInfo] = useState<{ larger: number; smaller: number; article: number | null }>({
    larger: 0,
    smaller: 0,
    article: null,
  });


  const table = plitkiMass

  const handleInputChange = (article: number, value: string) => {
    setQuantities({...quantities, [article]: value});
  };

  const calculate = (item: PlitkiType) => {
    const quantity = parseFloat(quantities[item.article] || '0');
    const packs = Math.floor(quantity / item.packageM2);
    const remainingM2 = quantity % item.packageM2;

    let remainingPieces;

    if (item.m2quantity > 0.001) {
      remainingPieces = Math.round(remainingM2 / item.m2quantity);
    } else {
      remainingPieces = Math.round(remainingM2 / item.size);
    }

    const validRemainingM2 = item.m2quantity > 0.001
      ? remainingPieces * item.m2quantity
      : remainingPieces * item.size;

    if (Math.abs(remainingM2 - validRemainingM2) > 1e-6) {
      const smallerValidM2 = packs * item.packageM2 + remainingPieces * (item.m2quantity > 0.001 ? item.m2quantity : item.size);
      const largerValidM2 = packs * item.packageM2 + (remainingPieces + 1) * (item.m2quantity > 0.001 ? item.m2quantity : item.size);

      setDialogInfo({larger: largerValidM2, smaller: smallerValidM2, article: item.article});
      return;
    }

    setResults({...results, [item.article]: {packs, pieces: remainingPieces}});
  };

  const closeDialog = () => {
    setDialogInfo({larger: 0, smaller: 0, article: null});
  };


  return (
    <>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>№</TableCell>
              <TableCell>Артикул</TableCell>
              <TableCell>Наименование</TableCell>
              <TableCell>м2 / 1шт</TableCell>
              <TableCell>Упак шт / м2</TableCell>
              <TableCell>Кол-во м2</TableCell>
              <TableCell>Действие</TableCell>
              <TableCell>Результат</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {table.map((item, index) => (
              <TableRow key={item.article}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{item.article}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.m2quantity}</TableCell>
                <TableCell>{`${item.packingPieces} / ${item.packageM2}`}</TableCell>
                <TableCell>
                  <TextField
                    type="text"
                    value={quantities[item.article] || ''}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange(item.article, e.target.value)}
                    fullWidth
                    placeholder="0.00"
                  />
                </TableCell>
                <TableCell>
                  <Button variant="contained" color="primary" onClick={() => calculate(item)}>
                    Посчитать
                  </Button>
                </TableCell>
                <TableCell>
                  {results[item.article] && (
                    <>
                      <div>{`Пачки: ${results[item.article].packs}`}</div>
                      {results[item.article].pieces > 0 &&
                        <div>{`Оставшиеся шт: ${results[item.article].pieces}`}</div>}
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={dialogInfo.article !== null} onClose={closeDialog}>
        <DialogTitle>Неверные данные для артикула {dialogInfo.article}</DialogTitle>
        <DialogContent>
          <div>{`Большее значение: ${dialogInfo.larger.toFixed(2)} м²`}</div>
          <div style={{color: 'red'}}>{`Меньшее значение: ${dialogInfo.smaller.toFixed(2)} м²`}</div>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} color="primary">
            Закрыть
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Plitki;
