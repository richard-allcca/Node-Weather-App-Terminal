# Aplicación de clima para terminal

CLI interactiva para buscar una ciudad y consultar su clima actual.

## Requisitos

- Node.js 18 o superior
- Claves de API de Mapbox y OpenWeather

## Configuración

Instala las dependencias y crea un archivo `.env` en la raíz con estas variables:

```env
MAPBOX_KEY=tu_clave_de_mapbox
OPENWEATHER_KEY=tu_clave_de_openweather
```

Puedes partir de `.env.example`. No compartas ni subas las claves reales.

## Uso

```sh
npm ci
npm start
```

El historial guarda hasta cinco ciudades en `db/database.json`.

## Comprobaciones

```sh
npm test
npm run lint
```

## Capturas

![Menú de la aplicación](./assets/menu-app.jpeg)
![Selección de ciudad](./assets/selecciona-opcion.jpeg)
![Respuesta del clima](./assets/respuesta-api.jpeg)
