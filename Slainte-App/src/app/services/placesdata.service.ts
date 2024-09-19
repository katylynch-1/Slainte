import { Injectable } from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesdataService {

  private apiUrl = 'http://localhost:3000/api/places'; // Update with your server URL

  constructor(private http: HttpClient) { }

  getBars(lat: number, lng: number, radius: number, type: string): Observable<any> {
    return this.http.get(`${this.apiUrl}?location=${lat},${lng}&radius=${radius}&type=${type}}`);
  }
}
