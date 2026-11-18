const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../data/items.json');

async function readItems() {
  try {
    const data = await fs.readFile(DATA_FILE, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    if (err.code === 'ENOENT') return [];
    throw err;
  }
}

async function writeItems(items) {
  await fs.writeFile(DATA_FILE, JSON.stringify(items, null, 2), 'utf8');
}

async function getAllItems() {
  return await readItems();
}

async function createItem(newItemData) {
  const items = await readItems();

  // Verificare serial duplicat -> eroare 409
  const exists = items.some(
    (item) => item.serialNumber.toLowerCase() === newItemData.serialNumber.trim().toLowerCase()
  );
  if (exists) {
    const error = new Error('Există deja un obiect cu acest număr de serie.');
    error.statusCode = 409;
    throw error;
  }

  const nextId = items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1;

  const newItem = {
    id: nextId,
    name: newItemData.name.trim(),
    serialNumber: newItemData.serialNumber.trim(),
    value: Number(newItemData.value),
    category: newItemData.category.trim(),
    purchaseDate: newItemData.purchaseDate
  };

  items.push(newItem);
  await writeItems(items);
  return newItem;
}

async function updateItem(id, updatedData) {
  const items = await readItems();
  const index = items.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    const error = new Error('Obiectul nu a fost găsit.');
    error.statusCode = 404;
    throw error;
  }

  // Verificare serial duplicat la alt obiect -> eroare 409
  const duplicateSerial = items.some(
    (item) =>
      item.id !== Number(id) &&
      item.serialNumber.toLowerCase() === updatedData.serialNumber.trim().toLowerCase()
  );
  if (duplicateSerial) {
    const error = new Error('Alt obiect folosește deja acest număr de serie.');
    error.statusCode = 409;
    throw error;
  }

  items[index] = {
    ...items[index],
    name: updatedData.name.trim(),
    serialNumber: updatedData.serialNumber.trim(),
    value: Number(updatedData.value),
    category: updatedData.category.trim(),
    purchaseDate: updatedData.purchaseDate
  };

  await writeItems(items);
  return items[index];
}

async function deleteItem(id) {
  const items = await readItems();
  const index = items.findIndex((item) => item.id === Number(id));

  if (index === -1) {
    const error = new Error('Obiectul nu a fost găsit.');
    error.statusCode = 404;
    throw error;
  }

  items.splice(index, 1);
  await writeItems(items);
}

module.exports = {
  getAllItems,
  createItem,
  updateItem,
  deleteItem
};
