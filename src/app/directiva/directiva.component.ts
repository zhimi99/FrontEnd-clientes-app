import { Component } from '@angular/core';


@Component({
  selector: 'app-directiva',
  templateUrl: './directiva.component.html'
})



export class DirectivaComponent{

  listaCurso: string[] = ['TypeScrip','JavaScrip','Java SE', 'C#', 'PHP'];
  habilitar: boolean = true;

  constructor() { }

  setHabilitar(): void {
    this.habilitar = (this.habilitar==true)? false: true;
  }

}
