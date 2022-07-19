  import { Injectable } from '@angular/core';
  //import {formatDate, DatePipe } from '@angular/common';
  import { Cliente } from './cliente';
  import { Region } from './region';
  import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
  import { map, catchError, tap } from 'rxjs/operators';
  import { Observable, throwError } from 'rxjs';
  import { Router } from '@angular/router';

  @Injectable({
    providedIn: 'root'
  })

  export class ClienteService {

    private urlEndPoint: string = 'http://localhost:8080/api/clientes';

    constructor(private http: HttpClient, private router: Router) { }


    getRegiones(): Observable<Region[]> {
      return this.http.get<Region[]>(this.urlEndPoint + '/regiones');
    }


    getClientes(page: number): Observable<any> {
      return this.http.get(this.urlEndPoint + '/page/' + page).pipe(
        tap((response: any) => {
          console.log('ClienteService: tap 1');
          (response.content as Cliente[]).forEach( cliente => {
            console.log(cliente.nombre);
          });
        }),

        map ((response:any) => {
          (response.content as Cliente[]).map(cliente => {
            cliente.nombre = cliente.nombre.toUpperCase();
          //let datePipe  = new DatePipe('en-US');
          //datePipe.transform(cliente.createAt, 'dd-MM-yyyy')
          //cliente.createAt = formatDate(cliente.createAt, 'EEEE dd, MMMM yyyy', 'es');
          return cliente;
        });
        return response;
      }),

      tap(response => {
        console.log('ClienteService: tap 2');
        (response.content as Cliente[]).forEach(cliente => {
        console.log(cliente.nombre);
      });
    })
  );//return of(CLIENTES);
}


    //crear Cliente y manda del formulario al backend
    create(cliente: Cliente): Observable<Cliente> {
      return this.http.post<any>(this.urlEndPoint, cliente).pipe(
        map( (response: any) =>  response.cliente as Cliente),
        catchError(e => {

          if(e.status==400){
            return throwError(e);
          }
          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }
            return throwError(e);
        }));
    }


    //lista cliente por id
    getCliente(id): Observable<Cliente> {
      return this.http.get<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {
          if(e.status != 401 && e.error.mensaje){
            this.router.navigate(['/clientes'])
            console.error(e.error.mensaje);
          }

          return throwError(e);
        }));
    }


    update(cliente: Cliente): Observable<any> {
      return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente).pipe(
      catchError(e => {

        if(e.status==400){
          return throwError(e);
        }

        if(e.error.mensaje){
          console.error(e.error.mensaje);
        }
        return throwError(e);
      })
     );
    }


    delete(id: number): Observable<Cliente> {
      return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`).pipe(
        catchError(e => {

          if(e.error.mensaje){
            console.error(e.error.mensaje);
          }
          return throwError(e);
        })
      );
    }


    subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{

      let formData = new FormData();
      formData.append("archivo", archivo);
      formData.append("id", id);

      const req = new HttpRequest('POST',`${this.urlEndPoint}/upload`, formData,{
        reportProgress: true,
      });

      return this.http.request(req);
    }

  }
