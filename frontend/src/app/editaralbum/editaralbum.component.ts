import { Component, OnInit } from '@angular/core';
import { Album } from "../models/album.model";
import { usuarioCompleto } from '../models/user';
import { AlbumService } from "../services/album.service";
import { UsuarioService } from '../services/usuario.service';
@Component({
  selector: 'app-editaralbum',
  templateUrl: './editaralbum.component.html',
  styleUrls: ['./editaralbum.component.css']
})
export class EditaralbumComponent implements OnInit {

  albumes:Album[];
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  
  nombre_album:string = " ";

  mensaje:string = 'Debe de escribir un nombre para el álbum a crear.';

  usuario: usuarioCompleto = JSON.parse(localStorage.getItem('usuario'));

  user_id = this.usuario.idUsuario;
  
  constructor( private albumService:AlbumService, private usuarioService:UsuarioService ) { }

  ngOnInit(): void {
    this.albumService.getObtenerAlbumes(this.user_id).subscribe((data: Album[])=>{
      this.albumes = data;
    });
  }

  crear_album(nombre:string){
    this.nombre_album = nombre;
    this.mensaje = 'Debe de escribir un nombre para el álbum a crear.';
    if(nombre.length>0){
      this.albumService.postVerificarAlbum(nombre, this.user_id).subscribe((data: Album[])=>{
        if(data.length==0){
          this.albumService.postCrearAlbum(this.user_id, nombre).subscribe(() =>{
            this.mensaje = 'álbum ' + nombre + " creado correctamente";
            this.nombre_album = '';
            this.ngOnInit();
          });
        }else{
          this.mensaje = 'Ya existe un álbum con el nombre ' + nombre;
          this.nombre_album = '';
        }
      });
    }
  }

  eliminar_album(idAlbum){
    if(idAlbum != 0){
      this.nombre_album = ' ';
      this.albumService.postEliminarAlbum(idAlbum).subscribe(()=>{
        this.mensaje = 'Album borrado de su colección ';
        this.nombre_album = '';
        this.ngOnInit();
      });
    }
    
  }

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
    
  }
}
