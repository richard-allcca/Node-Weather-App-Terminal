const inquirer = require('inquirer');
require('colors');

const preguntas = [
  {
    type: 'list',
    name: 'option',
    message: '¿Que deseas hacer?\n',
    choices: [
      {
        value: 1,
        name: `${'1'.green} Buscar ciudad`,
      },
      {
        value: 2,
        name: `${'2'.green} Historial`,
      },
      {
        value: 0,
        name: `${'0'.green} Salir`,
      },
    ],
  },
];

// ===============================
// ? control de menu
// ===============================
const inquirerMenu = async () => {
  console.log('======================'.green);
  console.log('Seleccione una Opción');
  console.log('======================\n'.green);

  const { option } = await inquirer.prompt(preguntas);

  return option;
};

// ===============================
// ? control de búsqueda
// ===============================
const leerInput = async (message) => {
  const question = [
    {
      type: 'input',
      name: 'msj',
      message,
      validate(value) {
        if (value.trim().length === 0) return 'Por favor ingresa un valor';
        return true;
      },
    },
  ];
  const { msj } = await inquirer.prompt(question);
  return msj;
};
// ===============================
// ? control de pausa
// ===============================
const pausa = async () => {
  const question = [
    {
      type: 'input',
      name: 'enter',
      message: `Presiona ${'Enter'.green} para continuar\n`,
    },
  ];
  // console.log("\n");
  await inquirer.prompt(question);
};

// ===============================
// ? control de respuesta
// ===============================
const listaLugares = async (lugares = []) => {
  if (!lugares.length) return '0';

  // lista de lugares a seleccionar
  const choices = lugares.map((lugar, i) => {
    const idx = `${i + 1}.`.green;

    return {
      value: lugar.id,
      name: `${idx} ${lugar.nombre}`,
    };
  });

  // Agrega la opción 0 para cancelar
  choices.unshift({
    value: '0',
    name: `${'0'.green} Cancelar`,
  });

  const questions = [
    {
      type: 'list',
      name: 'id',
      message: 'Seleccione lugar',
      choices,
    },
  ];

  const { id } = await inquirer.prompt(questions);
  return id;
};

module.exports = {
  leerInput,
  inquirerMenu,
  pausa,
  listaLugares,
};
