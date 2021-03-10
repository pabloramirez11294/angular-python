import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component'
import { RegistroComponent } from "./registro/registro.component";
import { HomeComponent } from "./home/home.component";
import { EditaralbumComponent } from './editaralbum/editaralbum.component';
import { VerfotosComponent } from "./verfotos/verfotos.component";
import { SubirfotoComponent } from "./subirfoto/subirfoto.component";
import { EditarperfilComponent } from "./editarperfil/editarperfil.component";

const routes: Routes = [
  { 
    path: 'login', 
    component: LoginComponent 
  },
  { 
    path: 'registro', 
    component: RegistroComponent 
  },
  { path: 'home', component: HomeComponent },
  { path: 'editar-album', component: EditaralbumComponent },
  { path: 'ver-fotos', component: VerfotosComponent },
  { path: 'editar-perfil', component: EditarperfilComponent },
  { path: 'subir-foto', component: SubirfotoComponent },
  { path: '**', redirectTo: '/home', pathMatch: 'full' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
