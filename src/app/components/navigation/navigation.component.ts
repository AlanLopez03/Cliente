import { Component,OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { loginModel } from '../../models/loginModel';
import { Router } from '@angular/router';
import { Producto } from '../../models/producto';
import { InventarioService } from '../../services/inventario/inventario.service';
import { CategoriaService } from '../../services/categoria/categoria.service';
import { Categoria } from '../../models/categoria';
import { ChangeDetectorRef } from '@angular/core';
import { MostrarProductosComponent } from '../mostrar-productos/mostrar-productos.component';
import { Location } from '@angular/common';
import Swal from 'sweetalert2';
import e from 'cors';
declare var $:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{
  categorias: Categoria []= [];
  productos: Producto[] = [];
constructor(private router:Router,private categoriaService:CategoriaService,private inventarioService:InventarioService,private location: Location) { }
  ngOnInit(): void {
    $(document).ready(function(){
      $('.sidenav').sidenav();
      $(".dropdown-trigger").dropdown();
    });

    this.categoriaService.list().subscribe(
      (res:any) => {
        this.categorias = res;
      },
      err => console.log(err)
    );
  
  }

  isHome(): boolean {
    return this.router.url === '/home';
  }

  logOut(){//Funciona para cerrar sesion pero no se como hacer para que se cierre la sesion en el servidor
    console.log('salir');
    console.log(localStorage.getItem('idUsuario'));
    localStorage.removeItem('idUsuario');
    this.router.navigateByUrl('/login');

  }

  Anillos(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "1");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()

  }
  Aretes(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "2");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()
  }
  Arracadas(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "3");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()
  }
  Esclavas(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "4");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()
  }
  Dijes(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "5");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()
  }
  Collares(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "8");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()
  }
  Todas(){
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
    }
    localStorage.setItem('Categoria', "0");
    localStorage.setItem('Arreglo', "9");
    this.reloadPage()
  }
  reloadPage() {
    const currentUrl = this.location.path();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
  });}

  MostrarOfertas(id: any) {
      //Debe redirigir al home
    if (!this.isHome()) {
      // Agrega tu lógica para redirigir a la página 'home' si no estás en ella
      this.router.navigateByUrl('/home');
      this.reloadPage();
    }
     localStorage.setItem('Categoria', '-1');
      this.inventarioService.obtenerOfertas().subscribe(
        (res: any) => {
            this.productos = res;
            localStorage.setItem('Arreglo', JSON.stringify(this.productos));
            this.reloadPage();
        },
      err => console.log(err)
    );
  }    
}
