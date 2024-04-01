import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class InventarioService {

  constructor(private http: HttpClient) { }
  listone(id : any) {
    return this.http.get(`${environment.API_URI}/productos/${id}`);
    }
  list() {
    return this.http.get(`${environment.API_URI}/productos`);
    }
  actualizar(producto: any) {
    return this.http.put(`${environment.API_URI}/productos/actualizar/${producto.idProducto}`, producto);
  }
  eliminar(id : any) {
    return this.http.delete(`${environment.API_URI}/productos/eliminar/${id}`);
  }
  crear(producto: any) {
    return this.http.post(`${environment.API_URI}/productos/crearProducto`, producto);
  }
  buscarProducto(nombre : any) {
    return this.http.post(`${environment.API_URI}/productos/buscarNombre`,nombre);
  }
  filtrarProductos(id : any) {
    return this.http.get(`${environment.API_URI}/productos/filtrarProductos/${id}`);
  }
  agregarStock(producto: any) {
    return this.http.put(`${environment.API_URI}/productos/agregarStock/${producto.idProducto}`, producto);
  }

  BuscarProducto(nombre : any) {
    return this.http.get(`${environment.API_URI}/productos/buscarProducto/${nombre}`);
  }
}
