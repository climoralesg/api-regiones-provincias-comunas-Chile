import { request } from 'express';
import { response } from 'express';


const index=(req=request, res=response)=>{
    res.status(200).json('Bienvenido a mi api');
}


export {index};