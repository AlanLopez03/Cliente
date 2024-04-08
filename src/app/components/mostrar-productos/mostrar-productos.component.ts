import { Component, OnInit } from '@angular/core';
import { InventarioService } from '../../services/inventario/inventario.service';
import { Producto } from '../../models/producto';
import { Router } from '@angular/router';
import { addProducto } from '../../models/carrito';
import { CarritoService } from '../../services/carrito/carrito.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';
declare var $: any;
@Component({
  selector: 'app-mostrar-productos',
  templateUrl: './mostrar-productos.component.html',
  styleUrl: './mostrar-productos.component.css'
})
export class MostrarProductosComponent implements OnInit {
  inserta = new addProducto();
  producto = new Producto();
  productos: Producto[] = [];
  buscar: string = '';
  imagenes = ["anillo_u.jpg", "aretes_u.jpg", "arracadas_u.jpg", "esclavas_u.jpg", "Dijes_u.jpg", "Corazon.jpeg"]
  campoEnfocado: boolean = false;
  constructor(private inventarioService: InventarioService, private carritoService: CarritoService, private router: Router) { }
  ngOnInit(): void {
    $(document).ready(function () {
      $('.carousel').carousel({
      }
      );
    });
    if ((localStorage.getItem("Categoria") == null || localStorage.getItem("Categoria") == '0' ) ||  localStorage.getItem("Arreglo") == null) {
      this.inventarioService.list().subscribe(
        (res: any) => {
          this.productos = res;
        },
        err => console.log(err)
      );
///<<<<<<< HEAD
///    } else {
///      this.inventarioService.buscarporCategoria(localStorage.getItem("Categoria")).subscribe((res: any) => {
///        if(res.length == 0){
///=======
    }else {
    const productosString = localStorage.getItem('Arreglo');
      if (productosString != '9' && productosString != null) {
        this.productos = JSON.parse(productosString);
      }else{
        if(localStorage.getItem("Categoria") == "-1"){
// origin/Jose
          Swal.fire({
            title: 'Sin productos',
            text: 'No hay productos por mostrar',
            icon: 'warning',
            confirmButtonText: 'Aceptar'
          })
        }
        //this.reloadPage();
        if (localStorage.getItem("Categoria") != "-1") {
          this.inventarioService.buscarporCategoria(localStorage.getItem("Categoria")).subscribe((res: any) => {
            console.log(res)
            console.log("Ingreso")
            if(res.length == 0){
              Swal.fire({
                title: 'Sin productos',
                text: 'No hay productos por mostrar en esta categoria',
                icon: 'warning',
                confirmButtonText: 'Aceptar'
              })
            }
            else{
              this.productos = res
              console.log("Hay productos")
            }
          }, err => console.log(err)
          );
        }
      }
    }
    localStorage.removeItem("Categoria");
    localStorage.removeItem("Arreglo");
  }

  listarOfertas() {
    this.inventarioService.obtenerOfertas().subscribe(
      (res: any) => {
        if (res.length > 0)
          this.productos = res;
        else
          Swal.fire(
            'Error',
            'No hay ofertas disponibles',
            'error')
      },
      err => console.log(err)
    );
  }

  Restablecer() {
    this.buscar = '';
    this.inventarioService.list().subscribe(
      (res: any) => {
        this.productos = res;
      },
      err => console.log(err)
    );
  }

  quitarTexto(){
    this.campoEnfocado = true;
  }

  restaurarTexto(){
    if (this.buscar === '') {
      this.campoEnfocado = false;
    }
  }

  agregarProducto(id: any) {//Recibe el id del producto
    var a = localStorage.getItem('idUsuario') ?? '1';
    var stock = 0;
    this.inserta.setAtributos(id, parseInt(a), 1);
    this.inventarioService.listone(id).subscribe(
      (res: any) => {
        stock = res.stock;
        console.log(stock);
        if (stock > 0) {
          this.carritoService.insertar(this.inserta).subscribe((res: any) => {
            Swal.fire(
              'Producto agregado',
              'El producto se ha agregado con éxito',
              'success')
          },
            err => console.log(err));
        }
        else {
          Swal.fire(
            'Error',
            'No hay stock suficiente',
            'error')
        }
      },
      err => console.log(err)
    );
  }

  Buscar() {
    if( this.buscar == ''){
      this.inventarioService.list().subscribe(
        (res: any) => {
          this.productos = res;
        },
        err => console.log(err)
      );
    } else {
      this.inventarioService.BuscarProducto(this.buscar).subscribe((res: any) => {
        if (res.id_producto == -1) {
          this.productos = [];
        }
        else {
          this.productos = res;
        }
      },
        err => console.log(err)
      );
    }
  }

  filtrarProductos(id: any) {
    this.inventarioService.filtrarProductos(id).subscribe(
      (res: any) => {
        this.productos = res;
        console.log(this.productos);
      },
      err => console.log(err)
    );
  }


  seleccionarImagen(Categoria : any) : string {
    if(Categoria == 1)
      return this.imagenes[0]
    if(Categoria == 2)
      return this.imagenes[1]
    if(Categoria == 3)
      return this.imagenes[2]
    if(Categoria == 4)
      return this.imagenes[3]
    if(Categoria == 5)
      return this.imagenes[4]
    if(Categoria == 8)
      return this.imagenes[5]
    return "img1.png"
  }

}

