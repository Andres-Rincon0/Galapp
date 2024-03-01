const express = require('express');
const fs = require('fs').promises;

const app = express();
const PORT = 5000;

app.use(express.json()); // for parsing application/json

const DATA = 'data';
/**
* leer los datos desde el archivo JSON 
*@param {String} entity  - nombre de la entidad 
*@returns {Object} data   - objeto con el contenido desde JSON
*/

const cargarDatos = async (entity)=>{
    try {
        const file_data = await fs.readFile(`${DATA}/${entity}.json`, 'utf-8');
        return JSON.parse(file_data);
    } catch (error) {
        console.log(`Error al leer los ${entity} JSON file: `, error);
        return{};
    }
};

/**
* gurdar los datos en el archivo JSON 
*@param {String} entity  - nombre de la entidad 
*@param {Object} data   - datos guardados  en un Objeto JSON
*/

const gurdarDatos = async (entity, data)=>{
    try {
        await fs.writeFile(`${DATA}/${entity}.json`, JSON.stringify(data, null, 4), 'utf-8')
    } catch (error) {
        console.log(`Error al gurdar los  ${entity} JSON file: `, error);
    }
};

app.get('/:entity', async (req, res) => {
    const { entity } = req.params;
    const data = await cargarDatos(entity);
    res.json(data);
  });

  app.get('/:entity/:id', async (req, res) => {
    const { entity, id } = req.params;
    const data = await cargarDatos(entity);
    if (!data[id]) {
      return res.status(400).send('Record not found');
    }
    res.json(data[id]);
  });

  app.post('/:entity', async (req, res) => {
    const { entity } = req.params;
    const id = Date.now();
    const record = req.body;
    const data = await cargarDatos(entity);
    data[id] = record;
    await gurdarDatos(entity, data);
    res.status(201).send('Record added');
  });

  app.put('/:entity/:id', async (req, res) => {
    const { entity, id } = req.params;
    const record = req.body;
    const data = await cargarDatos(entity);
    if (!data[id]) {
      return res.status(400).send('Record not found');
    }
    data[id] = record;
    await gurdarDatos(entity, data);
    res.send('Record updated');
  });

  app.delete('/:entity/:id', async (req, res) => {
    const { entity, id } = req.params;
    const data = await cargarDatos(entity);
    if (!data[id]) {
      return res.status(400).send('Record not found');
    }
    delete data[id];
    await gurdarDatos(entity, data);
    res.send('Record deleted');
  });

  app.listen(PORT, ()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
  })