import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IdiomaService {
  //Debe guardar el lenguaje actuar en el local storage para que al recargar la pagina no se pierda el idioma
  private defaultLanguage = localStorage.getItem('idioma') || 'es';
  private languageSource = new BehaviorSubject<string>(this.defaultLanguage);//Variable que almacena el idioma actual,por defecto es español
  currentLanguage = this.languageSource.asObservable();//Se convierte en un observable para que los componentes se suscriban a el
  constructor() {
  }
  changeLanguage(language: string) {//Funcion que cambia el idioma
    localStorage.setItem('idioma', language);//Guarda el idioma en el localstorage
    this.languageSource.next(language);
  }
}
