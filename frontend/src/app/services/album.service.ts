import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { Router } from '@angular/router';

import { Album } from "../models/album.model";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlbumService {

  API_URI = "http://bl-practica1-2134020371.us-east-2.elb.amazonaws.com:5000";

  constructor(private http: HttpClient, private route: Router) { }

  getObtenerAlbumes(id:number):Observable<Album[]>{
      return this.http.get<Album[]>(`${this.API_URI}/obteneralbumes/${id}`);
  }

  postCrearAlbum(id_usuario:number, nombre:string){
    return this.http.post(`${this.API_URI}/crear-album`, {"nombre": nombre, "id_usuario": id_usuario});
  }

  postVerificarAlbum(nombre, id_usuario):Observable<Album[]>{
      return this.http.post<Album[]>(`${this.API_URI}/verificar-album`, { "nombre": nombre, "id_usuario": id_usuario});
  }

  postEliminarAlbum(idAlbum ){
      return this.http.post(`${this.API_URI}/eliminar-album`, { "id_album":idAlbum });
  }
}
