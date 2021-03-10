import { Component, OnInit } from '@angular/core';
import { Album } from "../models/album.model";
import { FotoI } from '../models/foto.model';
import { usuarioCompleto } from '../models/user';
import { AlbumService } from "../services/album.service";

import { UsuarioService } from "../services/usuario.service";
import { FotoService } from "../services/foto.service";
@Component({
  selector: 'app-subirfoto',
  templateUrl: './subirfoto.component.html',
  styleUrls: ['./subirfoto.component.css']
})
export class SubirfotoComponent implements OnInit {
  mensaje = '';
  opcionSeleccionado: string  = '0';
  verSeleccion: string        = '';
  //albumes:Album[] = [{idAlbum: 1,idUsuario:2,nombre:"album1"},{idAlbum: 3,idUsuario:2,nombre:"album2"}];
  albumes:Album[] = [];
  nombre_album:string = " ";
  imagen = '../../assets/plantillaPerfil.jpg';
  selectFile;

  constructor(public userService: UsuarioService, private albumService:AlbumService, private fotoService: FotoService) { }

  ngOnInit(): void {
    if(!this.userService.estaLog()){
      this.mensaje = 'Iniciar sesion primero'
      return
    }
    const usuario: usuarioCompleto = JSON.parse(localStorage.getItem('usuario'));
    console.log(usuario.idUsuario)
    this.albumService.getObtenerAlbumes(usuario.idUsuario).subscribe((data: Album[])=>{
      this.albumes = data;
    });
    
  }

  subirFoto(nombre:string){
    if(!this.userService.estaLog()){
      this.mensaje = 'Iniciar sesion primero'
      return
    }else if(this.selectFile == undefined || this.verSeleccion === '' || nombre == ''){
      this.selectFile = false;
      this.mensaje = 'Llene todos los campos';
      return;
    }
    const foto: FotoI = {
      idAlbum: Number(this.verSeleccion),
      nombre: nombre,
      pathFoto: this.imag64      
    };
    console.log(foto)
    this.fotoService.postFoto(foto).subscribe((data: {})=> {
      this.mensaje = 'Foto enviada exitosamente';
      this.selectFile = false;
    }, error => {      
      this.mensaje = 'Error al enviar foto';
      this.selectFile = false;
    });
    
  }

  capturar() {
    // Pasamos el valor seleccionado a la variable verSeleccion
    this.verSeleccion = this.opcionSeleccionado;
  }

  imag64: string = '';
  handleUpload(event) {

    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const imagen: string = reader.result.toString();
        const sinMetadata: string = imagen.split(';base64,')[1];
        this.imagen = reader.result.toString();
        this.selectFile = true;
        this.imag64 = sinMetadata;
    };
  }

}
