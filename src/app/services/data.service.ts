import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observer, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {

  private protocol:string = 'https';
  private domain:string = 'hansbonini.com.br';
  private baseURI:string = `${this.protocol}://${this.domain}`;
  private recentPostListURI:string = `${this.baseURI}/api/recent-posts`;
  private categoriesListURI:string = `${this.baseURI}/api/categories`;
  private categoryURI:string = `${this.baseURI}/api/category`;
  private postURI:string = `${this.baseURI}/api/post`;

  constructor(private http: HttpClient) {}

  getRecentPosts(): Observable<any> {
    return this.http.get<any>(this.recentPostListURI);
  }

  getCategories(): Observable<any> {
    return this.http.get<any>(this.categoriesListURI);
  }

  getCategory(slug:string): Observable<any> {
    return this.http.get<any>(`${this.categoryURI}/${slug}`);
  }

  getPost(slug:string): Observable<any> {
    return this.http.get<any>(`${this.postURI}/${slug}`);
  }

}