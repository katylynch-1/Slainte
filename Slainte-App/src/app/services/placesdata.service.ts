import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PlacesdataService {

  private apiUrl = 'http://localhost:3000/api/places'; // Update with your server URL

  constructor(private http: HttpClient) { }

  getPubs(location: string, radius: number): Observable<any> {
    const params = new HttpParams()
      .set('location', location)
      .set('radius', radius.toString())
      .set('type', 'bar'); // 'bar' or 'pub' based on Google Places API types

    return this.http.get<any>(this.apiUrl, { params });
  }
}
