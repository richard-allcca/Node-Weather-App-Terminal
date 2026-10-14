const fs = require('fs');
const path = require('path');
const axios = require('axios');

class Searches {
  constructor({ dbPath = path.join(__dirname, '..', 'db', 'database.json') } = {}) {
    this.historial = [];
    this.dbPath = dbPath;
    this.leerDb();
  }

  get getHistorial() {
    return this.historial;
  }

  get historialCapitalizado() {
    return this.historial.map((lugar) => {
      const palabras = lugar.split(' ').map((palabra) => (
        palabra ? palabra[0].toUpperCase() + palabra.substring(1) : palabra
      ));

      return palabras.join(' ');
    });
  }

  get capitalizarPersonal() {
    this.historial = this.historial.map((lugar) => this.capitalizar(lugar));
    return this.historial;
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      limit: 5,
      language: "es",
    };
  }
  get getParamsWeather() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      units: "metric",
      lang: "es",
    };
  }

  async ciudad(nombre) {
    if (!process.env.MAPBOX_KEY) {
      throw new Error('Falta configurar MAPBOX_KEY en el archivo .env.');
    }

    try {
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(nombre.trim())}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (error) {
      const detail = error.response?.data?.message || error.message;
      throw new Error(`No se pudo buscar la ciudad: ${detail}`);
    }
  }

  async lugarClima(lat, lon) {
    if (!process.env.OPENWEATHER_KEY) {
      throw new Error('Falta configurar OPENWEATHER_KEY en el archivo .env.');
    }

    try {
      const instance = axios.create({
        baseURL: 'https://api.openweathermap.org/data/2.5/weather',
        params: { ...this.getParamsWeather, lat, lon },
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;
      if (!weather?.[0] || !main) {
        throw new Error('La respuesta del servicio meteorológico está incompleta.');
      }

      const { temp_min, temp_max, temp } = main;
      return {
        desc: weather[0].description,
        min: temp_min,
        max: temp_max,
        temp,
      };
    } catch (error) {
      const detail = error.response?.data?.message || error.message;
      throw new Error(`No se pudo consultar el clima: ${detail}`);
    }
  }
  agregarHistorial(lugar = '') {
    const normalizado = lugar.trim().toLocaleLowerCase();
    if (!normalizado) return;

    this.historial = [
      normalizado,
      ...this.historial.filter((entrada) => entrada !== normalizado),
    ].slice(0, 5);
  }

  guardarDb() {
    fs.mkdirSync(path.dirname(this.dbPath), { recursive: true });
    fs.writeFileSync(
      this.dbPath,
      JSON.stringify({ historial: this.historial }, null, 2),
      'utf8',
    );
  }

  leerDb() {
    if (!fs.existsSync(this.dbPath)) return;

    try {
      const historialDb = fs.readFileSync(this.dbPath, 'utf8');
      const data = JSON.parse(historialDb);
      if (!Array.isArray(data.historial)) {
        throw new Error('El historial no tiene el formato esperado.');
      }

      this.historial = data.historial
        .filter((lugar) => typeof lugar === 'string')
        .map((lugar) => lugar.toLocaleLowerCase())
        .slice(0, 5);
    } catch (error) {
      this.historial = [];
      console.warn(`No se pudo leer el historial; se iniciará vacío: ${error.message}`);
    }
  }

  capitalizar(text) {
    return text.split(' ').map((palabra) => (
      palabra ? palabra[0].toUpperCase() + palabra.substring(1) : palabra
    )).join(' ');
  }
}

module.exports = Searches;
