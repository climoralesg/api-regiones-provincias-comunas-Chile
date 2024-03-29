# Estado: Version Renovada, en prueba.

# Api division territorial de Chile :earth_americas:
Servicio Api de las regiones provincias y comunas de Chile basado
en Api de division politico administrativa de la Unidad de Modernización y Gobierno Digital del Ministerio Secretaria General de la Presidencia de Chile. 
https://apis.digital.gob.cl/dpa#geolocalizacion

### Contenido :page_facing_up:
1. Pre-requisitos
2. Instalacion
3. Ejecucion de consultas
4. Sobre el autor

## Pre-requisitos :pushpin:
- Node JS >= v16.16.0
- Almacenamiento de base de datos MongoDB
- Registro de documentos regiones en base de datos MongoDB (Ver archivo JSON en repositorio)
- Completar el archivo .ENV (revisar .env.example)

## Instalacion :rocket:

1. Instalar las dependencias de ejecucion

        npm install

2. Ejecutar el servicio 
   
        npm run start

## Ejecucion de consultas :speech_balloon:

Las consultas estan divididas en 3 grupos.

 - Regiones
 - Provincias
 - Comunas 

De estas consultas se puede extraer una lista o un sector determinado.

Todas las consultas devuelven Un Estado de peticion y la informacion requerida en formato JSON. Ejemplo:

Si solicitamos una comuna perteneciente a una region a traves de sus identificadores, esto entrega una comuna

        http://ip:port/regiones/{identificadorRegion}/comunas/{codigoComuna}

Seria el siguiente link de ejemplo

        http://ip:port/regiones/5ed1ff978383fea9148c3b65/comunas/vs0105
  
Arrojando como resultado dos elementos, el estado de la consulta y la comuna solicitada en formato JSON.

```
{
    "estado": {
        "codigo": 0,
        "respuesta": "Consulta realizada"
    },
    "comuna": {
        "nombre": "Puchuncaví",
        "codigo": "vs0105"
    }
}
```

### 1. Regiones 
Actualmente existen 16 regiones en el pais y es la principal division base del territorio chileno.

- Para consultar todas las regiones, esto entrega un estado y una lista de tipo regiones
  
        http://ip:port/regiones

- Para consultar una region mediante su id, esto entrega un estado y sector de tipo region

        http://ip:port/regiones/{identificadorRegion}
  
- Para consultar una region mediante su codigo ISO 3166-2, esto entrega un estado y un sector de tipo region
 
        http://ip:port/regiones/{identificadorRegionCodigoIso}


### 2. Provincias
Actualmente existem 56 provincias en el territorio chileno y es la subdivision de una region.

- Para consultar por todas las provincias, esto entrega un estado y una lista de tipo provincias.
  
        http://ip:port/provincias/

- Para consultar una provincia mediante su codigo, esto entrega un estado y un sector de tipo provincia.

        http://ip:port/provincias/{codigoProvincia}

- Para consultar por las provincias de una region mediante el identificador, esto entrega un estado y una lista de tipo provincias
        
        http://ip:port/regiones/{identificadorRegion}/provincias


### 3. Comunas

Actualmente existen 346 comunas en el territorio chileno y es la subdiviion de una region 

- Para consultar por todas las comunas presentes en el sistema, esto entrega un estado y una lista de tipo comunas
  
        http://ip:port/comunas/

- Para obtener una comuna a traves de su codigo, esto entrega un estado y un sector de tipo comuna 
        
        http://ip:port/comunas/{codigoComuna}

- Para tener el conjunto de comunas perteneciente a una provincia, esto entrega un estado y una lista de tipo comunas

        http://ip:port/provincias/{codigoProvincia}/comunas


- Para obtener las comunas de una region, esto entrega un estado y una lista de tipo comunas

        http://ip:port/regiones/{identificadorRegion}/comunas



## Autor :wave:
Para consultas criticas o sugerencias:

Usuario Github: github.com/climoralesg

Email: climoralesg@gmail.com
