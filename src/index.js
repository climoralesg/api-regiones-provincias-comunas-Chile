import '@babel/polyfill'; //permite utilizar el conjunto completo de características ES6 allá cambios de sintaxis

import app from './server'

import { connect } from './database'

//const conexion = connect();
//app.listen(3000); // server.listen();

async function main() {

    await app.listen(app.get('port'));
    //await connect();
    console.log('Iniciando Organizacion Territorial Chilena');

    console.log('Autor: climoralesg');
    console.log('Correo: climoralesg@gmail.com');

    console.log('Servidor en puerto ', app.get('port'));
}

main();
