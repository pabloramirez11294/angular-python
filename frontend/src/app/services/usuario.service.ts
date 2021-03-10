import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {Router} from '@angular/router';

import { usuario, usuarioCompleto } from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  API_URI = "http://bl-practica1-2134020371.us-east-2.elb.amazonaws.com:5000";

  constructor(private http: HttpClient, private route: Router) { }

  postLogin(userName:String, password: String) {
    return this.http.post(`${this.API_URI}/login`, {  "userName": userName, "password": password});
  }

  postRegistro(usuario: usuario){
    return this.http.post(`${this.API_URI}/register`, usuario);
  }

  getFotoPerfil(idUsuario: number){
    return this.http.get(`${this.API_URI}/fotoPerfil/${idUsuario}`);
  }

  estaLog():Boolean{
    return !!localStorage.getItem('usuario');
  }

  logOut(){
    localStorage.removeItem('usuario');
    this.route.navigate(['/login']);
  }

  putUsuario(usuario: usuarioCompleto){
    console.log('put> ',usuario)
    return this.http.put(`${this.API_URI}/editarPerfil`, usuario);
  }
}
