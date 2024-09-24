import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  private serverUrl = 'http://localhost:3000/api/place';

  constructor(private http: HttpClient) {}

    // getPlaces(query: string): Observable<any> {
    //   return this.http.get(`${this.serverUrl}?query=${query}`);
    // }

    // getPubs(lat: number, lng: number, radius: number, type: string): Observable<any> {
    //   return this.http.get("http://localhost:3000" + `/api/places?lat=${lat}&lng=${lng}&radius=${radius}&type=${type}&key=AIzaSyB6oHQCn8OiCT9jhQC87aUFElnyjjhFfX0`);
    // }

    //19/09/24

    getPubs(lat: number, lng: number, radius: number): Observable<any> {
      // No need to pass type or API key. The server handles it.
      return this.http.get(`${this.serverUrl}?lat=${lat}&lng=${lng}&radius=${radius}`);
    }
}

