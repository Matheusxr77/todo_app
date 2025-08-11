import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'todo-app';
  showLogout = false;

  constructor(private http: HttpClient, private router: Router) {
    this.router.events.subscribe(() => {
      this.showLogout = this.router.url.startsWith('/tasks');
    });
  }

  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Você precisa estar logado para acessar as tarefas.');
      throw new Error('Token não encontrado');
    }
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  logout() {
    const options = this.getAuthHeaders();
    this.http.post('/api/auth/logout', {}, options).subscribe({
      next: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      },
      error: () => {
        localStorage.removeItem('token');
        this.router.navigate(['/login']);
      }
    });
  }
}