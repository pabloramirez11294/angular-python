import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import {Router} from '@angular/router';

import { UsuarioService } from "../services/usuario.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})

export class LoginComponent implements OnInit {
  email: string = 'correo@gmail.com';
  pass: string = '1234';
  credentialsInvalid: boolean = false;
  messageError: string = '';

  constructor(private loginService: UsuarioService, private router:Router) {}
  
  ngOnInit(): void {}

  myForm = new FormGroup({
    userName: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20),
    ]),
    userPass: new FormControl("", [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(15)
    ]),
  });

  onSubmit(): void {
    const user = this.myForm.value;
    if(user.userName === ''  || user.userPass === ''){
      this.credentialsInvalid = true;
      this.messageError = 'Faltan campos a ingresar';
      setTimeout(() => {this.credentialsInvalid = false;},3500);
      return;
    }
    this.loginService.postLogin(user.userName , user.userPass).subscribe((data: {})=> {
      console.log(this.myForm.value);
      console.log(data);
      localStorage.setItem('usuario', JSON.stringify(data))
      this.router.navigateByUrl('/');
    }, error => {
      this.credentialsInvalid = true;
      if (error.status == 401 || error.status == 402)    
        this.messageError = error.error.message;
      else         
        this.messageError = 'Problemas en la conexión';
      
      console.log(error);
      setTimeout(() => {this.credentialsInvalid = false;},3500);
    })
      
  }
}
