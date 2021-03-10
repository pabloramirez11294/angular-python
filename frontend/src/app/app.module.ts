import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//Rutas
import { AppRoutingModule } from './app-routing.module';

//Servicios
import { UsuarioService } from "./services/usuario.service";
import { AlbumService } from "./services/album.service";
import { FotoService } from "./services/foto.service";

//Componentes
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { RegistroComponent } from './registro/registro.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { EditaralbumComponent } from './editaralbum/editaralbum.component';
import { VerfotosComponent } from './verfotos/verfotos.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatExpansionModule } from "@angular/material/expansion";
import { MatCardModule } from "@angular/material/card";
import { SubirfotoComponent } from './subirfoto/subirfoto.component';
import { EditarperfilComponent } from './editarperfil/editarperfil.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    LoginComponent,
    RegistroComponent,
    HomeComponent,
    EditaralbumComponent,
    VerfotosComponent,
    SubirfotoComponent,
    EditarperfilComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatExpansionModule,
    BrowserAnimationsModule,
    MatCardModule
  ],
  providers: [
    UsuarioService,
    AlbumService,
    FotoService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
