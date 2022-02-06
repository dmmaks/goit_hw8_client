import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
import { SearchManufacturerParams } from '../_models/search-manufacturer-params';
import { Manufacturer } from '../_models/manufacturer';

const baseUrl = `${environment.serverUrl}/manufacturers`;

@Injectable({
  providedIn: 'root'
})
export class ManufacturersService {
  manufacturerSearchParams: SearchManufacturerParams;
  constructor(
    private http: HttpClient
  ) {
  }


  private getSearchManufacturerList(currentPage: number, searchParams: SearchManufacturerParams, pageSize: number): Observable<Page<Manufacturer>> {
    return this.http.get<Page<Manufacturer>>(`${baseUrl}?`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchParams.name)
          .set('order', searchParams.order == 'asc')});
  }

  getManufacturersBySearch(searchParams: SearchManufacturerParams, pageSize: number): Observable<Page<Manufacturer>> {
    this.manufacturerSearchParams = searchParams;
    return this.getSearchManufacturerList(0, this.manufacturerSearchParams, pageSize);
  }

  getManufacturersByPageNum(currentPage: number, pageSize: number): Observable<Page<Manufacturer>> {
    return this.getSearchManufacturerList(currentPage, this.manufacturerSearchParams, pageSize);
  }

  getManufacturerById(id: string): Observable<Manufacturer> {
    return this.http.get<Manufacturer>(`${baseUrl}/${id}`);
  }

  deleteManufacturer(id: string) : Observable<Object> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  createManufacturer(manufacturer: Manufacturer): Observable<Object> {
    return this.http.post(`${baseUrl}`, manufacturer);
  }

  editManufacturer(manufacturer: Manufacturer): Observable<Object>{
    return this.http.put(`${baseUrl}/${manufacturer.id}`, manufacturer);
  }
}
