import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { Foto, FotoI } from "../models/foto.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FotoService {

  API_URI = "http://bl-practica1-2134020371.us-east-2.elb.amazonaws.com:5000";

  constructor(private http: HttpClient, private route: Router) { }

  getObtenerFotos(Album_id:number):Observable<Foto[]>{
    return this.http.get<Foto[]>(`${this.API_URI}/obtenerfotos/${Album_id}`);
  }

  postFoto(foto: FotoI){
    return this.http.post(`${this.API_URI}/foto`, foto);
  }

}
