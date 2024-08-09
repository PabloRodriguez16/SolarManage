import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient) {}

  async getAllUsers(): Promise<any> {
    try {
      const response = await firstValueFrom(
        this.http.get<any>(`${this.apiUrl}`)
      );
      console.log(response);

      return response;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  }

  async deleteUser(id: string): Promise<any> {
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });

      console.log(response);

      return response;
    } catch (error) {
      console.error('Error al obtener los datos:', error);
      throw error;
    }
  }
}
