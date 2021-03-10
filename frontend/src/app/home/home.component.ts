import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { usuario, usuarioCompleto } from '../models/user';

import { UsuarioService } from "../services/usuario.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  username:string = "Arnaldo68";
  nombre:string = "José Arnaldo";
  fotoPerfil: string = './assets/icono-de-perfil.jpg'

  constructor(private router: Router, private userService: UsuarioService) { }

  ngOnInit(): void {
    if(!this.userService.estaLog())
      return
    
    const usuario: usuarioCompleto = JSON.parse(localStorage.getItem('usuario'));
    this.nombre = usuario.nombre;
    this.username = usuario.userName;
    this.userService.getFotoPerfil(usuario.idUsuario).subscribe((data: {})=> {
      const path:any = data;
      console.log(path)
      this.fotoPerfil = `https://practica1-g19-imagenes.s3.us-east-2.amazonaws.com/${path.pathFoto}`;
    }, error => {      
      console.log(error);
    })
  }

  editar_album(){
    this.router.navigate(['/editar-album'])
  }

  ver_fotos(){
    this.router.navigate(['/ver-fotos']);
  }

}
