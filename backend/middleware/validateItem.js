function validateItem(req, res, next) {
  const { name, serialNumber, value, category, purchaseDate } = req.body;

  if (!name || typeof name !== 'string' || name.trim() === '') {
    return res.status(400).json({ error: 'Numele obiectului este obligatoriu.' });
  }

  if (!serialNumber || typeof serialNumber !== 'string' || serialNumber.trim() === '') {
    return res.status(400).json({ error: 'Numărul de serie este obligatoriu.' });
  }

  if (value === undefined || value === null || isNaN(Number(value)) || Number(value) < 0) {
    return res.status(400).json({ error: 'Valoarea trebuie să fie un număr pozitiv.' });
  }

  if (!category || typeof category !== 'string' || category.trim() === '') {
    return res.status(400).json({ error: 'Categoria este obligatorie.' });
  }

  if (!purchaseDate || typeof purchaseDate !== 'string' || purchaseDate.trim() === '') {
    return res.status(400).json({ error: 'Data achiziției este obligatorie.' });
  }

  next();
}

module.exports = validateItem;
