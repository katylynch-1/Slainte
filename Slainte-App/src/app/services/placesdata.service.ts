import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesdataService {

  private serverUrl = 'http://localhost:3000/api/place'; // Ensure this is the correct endpoint

  constructor(private http: HttpClient) {}

  getBars(lat: number, lng: number, radius: number): Observable<any> {
    // No need to pass type or API key. The server handles it.
    return this.http.get(`${this.serverUrl}?lat=${lat}&lng=${lng}&radius=${radius}`);
  }
}
