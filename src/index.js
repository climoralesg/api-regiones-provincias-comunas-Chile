import '@babel/polyfill'; //permite utilizar el conjunto completo de características ES6 allá cambios de sintaxis

import app from './server'

//import { connect } from './database'
//app.listen(3000); // server.listen();

async function main() {

    await app.listen(app.get('port'));
    //await connect();
    console.log('Servidor en puerto ', app.get('port'));
}

main();