import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesdataService {

  private serverUrl = 'http://localhost:3000/api/places'; // I think this has to match line 12 on backend server

  constructor(private http: HttpClient) {}

  getBars(lat: number, lng: number, radius: number, type: string, keyword: string): Observable<any> {
    return this.http.get(`${this.serverUrl}?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}&keyword=${keyword}`);
  }
}
