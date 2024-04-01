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
declare var $:any;
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent implements OnInit{
  categorias: Categoria []= [];

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
  logOut(){//Funciona para cerrar sesion pero no se como hacer para que se cierre la sesion en el servidor
    console.log('salir');
    console.log(localStorage.getItem('idUsuario'));
    localStorage.removeItem('idUsuario');
    this.router.navigateByUrl('/');

  }

  Anillos(){
    localStorage.setItem('Categoria', "1");
    this.reloadPage()

  }
  Aretes(){
    localStorage.setItem('Categoria', "2");
    this.reloadPage()
  }
  Arracadas(){
    localStorage.setItem('Categoria', "3");
    this.reloadPage()
  }
  Esclavas(){
    localStorage.setItem('Categoria', "4");
    this.reloadPage()
  }
  Dijes(){
    localStorage.setItem('Categoria', "5");
    this.reloadPage()
  }
  Collares(){
    localStorage.setItem('Categoria', "8");
    this.reloadPage()
  }
  Todas(){
    localStorage.setItem('Categoria', "0");
    this.reloadPage()
  }
  reloadPage() {
    const currentUrl = this.location.path();
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
        this.router.navigate([currentUrl]);
    });}

  MostrarOfertas(id:any)
  {
    //Debe redirigir al home
    
    this.inventarioService.verOfertas(id);

  }
  //buscarCategoria(id:any){
  //  this.mostrarProductosComponent.filtrarProductos(id);
  //}
  //(click)="buscarCategoria(categoria.idCategoria)
}
