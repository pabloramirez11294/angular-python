import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";
import { Album } from '../models/album.model';
import { Foto } from '../models/foto.model';
import { FotoService } from "../services/foto.service";
import { AlbumService } from "../services/album.service";
import { usuarioCompleto } from '../models/user';
import { UsuarioService } from '../services/usuario.service';
@Component({
  selector: 'app-verfotos',
  templateUrl: './verfotos.component.html',
  styleUrls: ['./verfotos.component.css']
})
export class VerfotosComponent implements OnInit {
  
  panelOpenState = false;

  albumes: Album[] = [];

  fotoAlbum: Foto[] = [];

  
  usuario: usuarioCompleto = JSON.parse(localStorage.getItem('usuario'));

  user_id = this.usuario.idUsuario;
  user_perfil = "";

  constructor( private router:Router, private fotoService:FotoService, 
               private albumService: AlbumService, private usuarioService: UsuarioService ) { }

  ngOnInit(): void {
    this.albumService.getObtenerAlbumes(this.user_id).subscribe((data: Album[])=>{
      this.albumes = data;
    });
    this.usuarioService.getFotoPerfil(this.user_id).subscribe((data:{})=>{
      const path:any = data;
      this.user_perfil = `https://practica1-g19-imagenes.s3.us-east-2.amazonaws.com/${path.pathFoto}`;
    });
  }

  editar_album(){
    this.router.navigate(['/editar-album']);
  }

  subir_foto(){
    this.router.navigate(['/subir-foto']);
  }

  panel_abre(idAlbum_){
    this.fotoAlbum = [];
    this.fotoService.getObtenerFotos(idAlbum_).subscribe((data: Foto[])=>{
      this.fotoAlbum = data;
    });
  }

}
