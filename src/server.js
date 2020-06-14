import express, { json } from 'express' //importa express y define constante
import IndexRoutes from './routes/index.routes'
import RegionesRoutes from './routes/regiones.routes'
import ProvinciasRoutes from './routes/provincias.routes'
import ComunasRoutes from './routes/comunas.routes'

const app = express();

//Opciones

app.set('port', process.env.PORT || 4000); //conecta el puerto

//Middlewares
app.use(json()); //toma los datos y los procesa para generar un json (POST)

//Rutas
app.use(IndexRoutes); //usa las rutas de index.Routes, podriamos poner rutas aqui pero por legibilidad las importamos

app.use('/regiones', RegionesRoutes);

app.use('/provincias', ProvinciasRoutes);

app.use('/comunas', ComunasRoutes);

export default app;