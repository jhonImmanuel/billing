import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: Http) { }
  callGetApi(url) {
    const httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(environment.apiUrl + url, httpOptions).pipe(map( res => {
      return res.json();
    }));
  }
  callPostApi(url, data) {
    const httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(environment.apiUrl + url, data, httpOptions).pipe(map( res => {
      return res.json();
    }));
  }
  callDeleteApi(url) {
    const httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.get(environment.apiUrl + url, httpOptions).pipe(map( res => {
      return res;
    }));
  }
  callPutApi(url, data) {
    const httpOptions = {
      headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': 'bearer ' + localStorage.getItem('token')
      })
    };
    return this.http.post(environment.apiUrl + url, data, httpOptions).pipe(map( res => {
      return res;
    }));
  }
}
