import { Component } from '@angular/core';
import { AuthService } from '../usuarios/auth.service';
import { Router } from  '@angular/router';
import swal from "sweetalert2";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent{

  LOGO = 'ZHIMI-APP';

  constructor(public authService: AuthService,  private router: Router) { }

  logout(): void{
    let username = this.authService.usuario.username;
    this.authService.logout();
    swal.fire('logout', `hola ${username},  has cerrado session`, 'success');
    this.router.navigate(['/login'])
  }

}
