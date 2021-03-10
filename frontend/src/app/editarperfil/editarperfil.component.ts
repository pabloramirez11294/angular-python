import { Component, OnInit } from '@angular/core';
import { usuario, usuarioCompleto } from '../models/user';
import {Router} from '@angular/router';
import { UsuarioService } from "../services/usuario.service";
@Component({
  selector: 'app-editarperfil',
  templateUrl: './editarperfil.component.html',
  styleUrls: ['./editarperfil.component.css']
})
export class EditarperfilComponent implements OnInit {
  mensaje = '';
  imagen = '../../assets/plantillaPerfil.jpg';
  selectFile = undefined;
  usuario: usuarioCompleto;

  constructor(public userService: UsuarioService, private router:Router) { }

  ngOnInit(): void {
    this.usuario = JSON.parse(localStorage.getItem('usuario'));
    this.userService.getFotoPerfil(this.usuario.idUsuario).subscribe((data: {})=> {
      const path:any = data;
      console.log(path)
      this.imagen = `https://practica1-g19-imagenes.s3.us-east-2.amazonaws.com/${path.pathFoto}`;
    }, error => {      
      console.log(error);
    })
  }

  editar(userName: string, nombre: string, password: string): void {
    if(password == undefined || password === ''){
      this.selectFile = false;
      this.mensaje = 'Ingrese contraseña';
      return;
    }
    if(this.selectFile == undefined){
      this.usuario.imag = '';
    }else
      this.usuario.imag = this.imag64;

    this.usuario.userName = userName;
    this.usuario.nombre = nombre;
    this.usuario.password = password;
    //console.log(this.usuario);
    this.userService.putUsuario(this.usuario).subscribe((data: {})=> {
      this.mensaje = 'Perfil editado exitosamente';
      this.selectFile = false; 

      //actualizar usuario
      this.userService.postLogin(this.usuario.userName, this.usuario.password).subscribe((data: {})=> {
        localStorage.setItem('usuario', JSON.stringify(data));
        this.ngOnInit();
        //this.router.navigate(['/hombe']);
        //window.location.reload();
      })
    }, error => {      
      this.mensaje = 'Error editar perfil';
      this.selectFile = false;
    });
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
