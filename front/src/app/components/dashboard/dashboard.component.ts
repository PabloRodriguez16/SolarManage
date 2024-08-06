import { Component, OnInit } from '@angular/core';
import { CargaComponent } from '../carga/carga.component';
import { HistorialComponent } from '../historial/historial.component';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CargaComponent,
    HistorialComponent,
    AdminComponent,
    RouterLink,
    RouterLinkActive,
    RouterOutlet,
    CommonModule,
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  mostrarBoton: boolean = false;
  token = localStorage.getItem('token');

  constructor(private authservice: AuthService) {}

  ngOnInit() {
    this.verificarCondicion();
  }

  verificarCondicion() {
    this.authservice.isAdmin().then((isAdmin) => {
      this.mostrarBoton = isAdmin;
    });
  }
}
