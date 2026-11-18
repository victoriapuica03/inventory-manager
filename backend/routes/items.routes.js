const express = require('express');
const router = express.Router();
const itemsService = require('../services/items.service');
const validateItem = require('../middleware/validateItem');

// GET /api/items - returnează toate obiectele
router.get('/', async (req, res, next) => {
  try {
    const items = await itemsService.getAllItems();
    res.status(200).json(items);
  } catch (err) {
    next(err);
  }
});

// GET /api/items/export.csv - descarcă inventarul în format CSV
router.get('/export.csv', async (req, res, next) => {
  try {
    const items = await itemsService.getAllItems();
    const headers = ['ID,Nume,Numar Serie,Valoare,Categorie,Data Achizitiei'];
    const rows = items.map((item) => {
      const safeName = `"${String(item.name).replace(/"/g, '""')}"`;
      const safeSerial = `"${String(item.serialNumber).replace(/"/g, '""')}"`;
      const safeCategory = `"${String(item.category).replace(/"/g, '""')}"`;
      return `${item.id},${safeName},${safeSerial},${item.value},${safeCategory},${item.purchaseDate}`;
    });

    const csvContent = '\uFEFF' + [headers, ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="inventar.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
});

// POST /api/items - adaugă un obiect nou
router.post('/', validateItem, async (req, res, next) => {
  try {
    const created = await itemsService.createItem(req.body);
    res.status(201).json(created);
  } catch (err) {
    next(err);
  }
});

// PUT /api/items/:id - editează un obiect existent
router.put('/:id', validateItem, async (req, res, next) => {
  try {
    const updated = await itemsService.updateItem(req.params.id, req.body);
    res.status(200).json(updated);
  } catch (err) {
    next(err);
  }
});

// DELETE /api/items/:id - șterge un obiect
router.delete('/:id', async (req, res, next) => {
  try {
    await itemsService.deleteItem(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

module.exports = router;
