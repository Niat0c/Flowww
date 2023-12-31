import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
//import { bootstrapApplication } from '@angular/platform-browser';
//import { appConfig } from './app.config';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [
    HttpClientModule,
    CommonModule,
    FormsModule,
  ]
})
export class AppLogin implements OnInit {

  public title = 'PabloBlasco-Frontend';
  private strToken: String = "";
  private ListaBusqueda: any = {};
  public jsonResultado: any;
  public jsonDatos: any;
  public PaginaActual: number = 1;
  public RegistrosPagina: number = 10;
  public TotalRegistrosBusqueda: number = 0;
  public PaginasTotales: number = 0;
  private strUltimaBusqueda: String = "";
  public blnLoading: Boolean = false;
  public MensajeError: any = { "Mensaje": "", "Tipo": "Error", "Mostrar": false };//"Tipo": "Error|Succes|Info"


  constructor(private http: HttpClient) { };

  //Realizamos la comprobacion del login
  onSubmit(form: NgForm) {
    this.blnLoading = true;
    //Variables locales
    var blnSeguir = true;

    //Validaciones
    if (blnSeguir && (form.value.strUser).toUpperCase() == "FLOWWW") {
      //alert("Palabra prohibida");
      this.MensajeError.Mensaje = "Palabra prohibida";
      this.MensajeError.Visible = true;
      setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
      blnSeguir = false;
    }
    if (blnSeguir && (form.value.strUser).length < 4) {
      //alert("La busqueda debe de tener minimo 4 caracteres");
      this.MensajeError.Mensaje = "La busqueda debe de tener minimo 4 caracteres";
      this.MensajeError.Visible = true;
      setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
      blnSeguir = false;
    }

    //Comprobamos si el login existe
    if (blnSeguir) {
      this.fnNuevaBusqueda(form.value.strUser);
    } else {
      this.blnLoading = false;
    }
  };

  //Funcion para la busqueda
  private fnNuevaBusqueda(strBusqueda: String) {
    this.blnLoading = true;

    this.strUltimaBusqueda = strBusqueda;

    //Realizamos la llamada para obtener el JSON
    this.LoginUsers(strBusqueda, this.PaginaActual).subscribe(respuesta => {
      //console.log(respuesta);
      this.ListaBusqueda = respuesta;

      //Obtenemos los datos del usuario
      if (this.ListaBusqueda.items.length > 0) {
        //this.jsonResultado = Object.assign([], this.ListaBusqueda);
        this.TotalRegistrosBusqueda = this.ListaBusqueda.total_count;
        this.PaginasTotales = Math.ceil(this.TotalRegistrosBusqueda / this.RegistrosPagina);
        this.jsonResultado = Object.assign([], this.ListaBusqueda.items);
      }

      //Comprobamos si existe el login
      if (this.jsonResultado != undefined) {
        if (this.jsonResultado.length > 0) {
          //alert("Buscando " + strBusqueda);
          this.strToken = this.GenerateToken();
          this.blnLoading = false;
        } else {
          //alert("Busqueda sin resultados");
          this.MensajeError.Mensaje = "Busqueda sin resultados";
          this.MensajeError.Tipo = "info";
          this.MensajeError.Visible = true;
          setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
        }
      } else {
        //alert("Busqueda erronea");
        this.MensajeError.Mensaje = "Busqueda erronea";
        this.MensajeError.Visible = true;
        setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
        this.blnLoading = false;
      }
    });
  };
  public fnBusquedaLimpiar() {
    this.jsonResultado = undefined;

    //alert("Busqueda sin resultados");
    this.MensajeError.Mensaje = "Busqueda limpiada correctamente";
    this.MensajeError.Tipo = "Succes";
    this.MensajeError.Visible = true;
    setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
  };

  //Generamos token de session
  private GenerateToken() {
    let text = "";
    var LargoToken: number = 40;
    var CaracteresPermitidos: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890,./;'[]\=-)(*&^%$#@!~`";
    for (let i = 0; i < LargoToken; i++) {
      text += CaracteresPermitidos.charAt(Math.floor(Math.random() * CaracteresPermitidos.length));
    }
    return text;
  };

  //Cargamos el JSON de los usuarios
  private LoginUsers(login: String, PaginaActual: number) {
    if (PaginaActual == undefined) { PaginaActual = 1; }
    return this.http.get('https://api.github.com/search/users?q=' + login.replaceAll(' ','') + '+in:login&per_page=' + this.RegistrosPagina + '&page=' + PaginaActual);
  };

  ngOnInit(): void {
  };

  //Funciones para MODAL
  public fnPantallaAbrir(Datos: any) {
    this.jsonDatos = Object.assign([], Datos);
    //window.open(strUrl, '_blank');
  };
  public fnPantallaCerrar() {
    this.jsonDatos = undefined;
    //window.open(strUrl, '_blank');
  };
  public fnPantallaUrl(strUrl: any) {
    window.open(strUrl, '_blank');
  };

  //Paginacion
  public fnPaginaPrim() {
    this.PaginaActual = 1;
    this.fnNuevaBusqueda(this.strUltimaBusqueda);
  };
  public fnPaginaSig() {
    if (this.PaginaActual < this.PaginasTotales) {
      this.PaginaActual = this.PaginaActual + 1;
      if ((this.RegistrosPagina * this.PaginaActual) > 30) { //Esto lo hacemos puesto que la API no devuelve mas de 30 registros
        this.PaginaActual = Math.ceil(30 / this.RegistrosPagina);

        //alert("Pagina limite, API de pruebas.";);
        this.MensajeError.Mensaje = "Pagina limite, API de pruebas.";
        this.MensajeError.Tipo = "Info";
        this.MensajeError.Visible = true;
        setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
      }
      this.fnNuevaBusqueda(this.strUltimaBusqueda);
    }

  };
  public fnPaginaAnt() {
    if (this.PaginaActual > 1) {
      this.PaginaActual = this.PaginaActual - 1;
      this.fnNuevaBusqueda(this.strUltimaBusqueda);
    }
  };
  public fnPaginaUlt() {
    this.PaginaActual = this.PaginasTotales;
    if ((this.RegistrosPagina * this.PaginaActual) > 30) { //Esto lo hacemos puesto que la API no devuelve mas de 30 registros
      this.PaginaActual = Math.ceil(30 / this.RegistrosPagina);

      //alert("Pagina limite, API de pruebas.";);
      this.MensajeError.Mensaje = "Pagina limite, API de pruebas.";
      this.MensajeError.Tipo = "Info";
      this.MensajeError.Visible = true;
      setTimeout(() => { this.MensajeError.Visible = false; this.MensajeError.Tipo = "Error"; }, 3000);
    }
    this.fnNuevaBusqueda(this.strUltimaBusqueda);
  };
}


