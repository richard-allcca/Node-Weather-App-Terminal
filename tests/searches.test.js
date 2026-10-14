const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const axios = require('axios');
const Searches = require('../models/searches');

const createSearches = (context) => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'weather-searches-'));
  context.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return new Searches({ dbPath: path.join(directory, 'db', 'database.json') });
};

test('el historial deduplica, mueve la ciudad al inicio y conserva cinco entradas', (context) => {
  const search = createSearches(context);
  for (let index = 1; index <= 6; index += 1) {
    search.agregarHistorial(`Ciudad ${index}`);
  }

  search.agregarHistorial('CIUDAD 4');

  assert.deepEqual(search.historial, [
    'ciudad 4',
    'ciudad 6',
    'ciudad 5',
    'ciudad 3',
    'ciudad 2',
  ]);
});

test('el historial se guarda y se carga desde la ruta configurada', (context) => {
  const search = createSearches(context);
  search.agregarHistorial('Lima, Perú');
  search.guardarDb();

  const loaded = new Searches({ dbPath: search.dbPath });

  assert.deepEqual(loaded.historial, ['lima, perú']);
});

test('un archivo de historial inválido inicia con una lista vacía', (context) => {
  const search = createSearches(context);
  fs.mkdirSync(path.dirname(search.dbPath), { recursive: true });
  fs.writeFileSync(search.dbPath, '{ inválido', 'utf8');
  const originalWarn = console.warn;
  console.warn = () => {};

  try {
    const loaded = new Searches({ dbPath: search.dbPath });
    assert.deepEqual(loaded.historial, []);
  } finally {
    console.warn = originalWarn;
  }
});

test('un fallo de red en la búsqueda se convierte en un error legible', async (context) => {
  const search = createSearches(context);
  const previousKey = process.env.MAPBOX_KEY;
  const originalCreate = axios.create;
  process.env.MAPBOX_KEY = 'test-key';
  axios.create = () => ({ get: async () => { throw new Error('sin conexión'); } });
  context.after(() => {
    axios.create = originalCreate;
    if (previousKey === undefined) delete process.env.MAPBOX_KEY;
    else process.env.MAPBOX_KEY = previousKey;
  });

  await assert.rejects(search.ciudad('Lima'), /No se pudo buscar la ciudad: sin conexión/);
});

test('un fallo de red del clima se convierte en un error legible', async (context) => {
  const search = createSearches(context);
  const previousKey = process.env.OPENWEATHER_KEY;
  const originalCreate = axios.create;
  process.env.OPENWEATHER_KEY = 'test-key';
  axios.create = () => ({ get: async () => { throw new Error('sin conexión'); } });
  context.after(() => {
    axios.create = originalCreate;
    if (previousKey === undefined) delete process.env.OPENWEATHER_KEY;
    else process.env.OPENWEATHER_KEY = previousKey;
  });

  await assert.rejects(search.lugarClima(0, 0), /No se pudo consultar el clima: sin conexión/);
});