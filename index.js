require('dotenv').config();

const {
  inquirerMenu,
  pausa,
  leerInput,
  listaLugares,
} = require('./helpers/inquirer');
const Searches = require('./models/searches');

require('colors');

const main = async () => {
  const search = new Searches();
  let opt;

  do {
    opt = await inquirerMenu();

    switch (opt) {
      case 1: {
        try {
          const busqueda = await leerInput('Ciudad');
          const lugares = await search.ciudad(busqueda);

          if (!lugares.length) {
            console.log('No se encontraron ciudades.'.yellow);
            break;
          }

          const id = await listaLugares(lugares);
          if (id === '0') break;

          const lugar = lugares.find((resultado) => resultado.id === id);
          if (!lugar) {
            console.log('La ciudad seleccionada ya no está disponible.'.yellow);
            break;
          }

          const clima = await search.lugarClima(lugar.lat, lugar.lng);
          console.log('\n Información de la ciudad\n'.green);
          console.log('Ciudad:', lugar.nombre.green);
          console.log('Lat:', lugar.lat);
          console.log('Long:', lugar.lng);
          console.log('Temperatura:', clima.temp);
          console.log('Mínima:', clima.min);
          console.log('Máxima:', clima.max);
          console.log('Está con:', clima.desc.green);

          search.agregarHistorial(lugar.nombre);
          try {
            search.guardarDb();
          } catch (error) {
            console.log(`No se pudo guardar el historial: ${error.message}`.red);
          }
        } catch (error) {
          console.log(`\n${error.message}`.red);
        }
        break;
      }
      case 2:
        if (!search.historial.length) {
          console.log('Todavía no hay ciudades en el historial.'.yellow);
          break;
        }

        search.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}`.green;

          console.log(`${idx} ${lugar}`);
        });
        break;

      default:
        break;
    }

    await pausa();
  } while (opt !== 0);
};

main().catch((error) => {
  console.error(`No se pudo iniciar la aplicación: ${error.message}`.red);
  process.exitCode = 1;
});
