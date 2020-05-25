import express from 'express' //importa express y define constante
import IndexRoutes from './routes/index.routes'
import RegionesRoutes from './routes/regiones.routes'


const app = express();

//Opciones

app.set('port',process.env.PORT || 4000); //conecta el puerto

app.use(IndexRoutes); //usa las rutas de index.Routes, podriamos poner rutas aqui pero por legibilidad las importamos
app.use('/regiones',RegionesRoutes);

export default app;