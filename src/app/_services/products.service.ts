import { Injectable } from '@angular/core';
import {environment} from "../../environments/environment";
import {HttpClient, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";
import {Page} from "../_models/page";
import { SearchManufacturerParams } from '../_models/search-manufacturer-params';
import { Manufacturer } from '../_models/manufacturer';
import { SearchProductParams } from '../_models/search-product-params';
import { Product } from '../_models/product';

const baseUrl = `${environment.serverUrl}/products`;

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  productSearchParams: SearchProductParams;
  constructor(
    private http: HttpClient
  ) {
  }


  private getSearchProductList(currentPage: number, searchParams: SearchProductParams, pageSize: number): Observable<Page<Product>> {
    return this.http.get<Page<Product>>(`${baseUrl}?`, {
        params: new HttpParams()
          .set('pageSize', pageSize)
          .set('pageNum', currentPage)
          .set('name', searchParams.name)
          .set('order', searchParams.order == 'asc')
          .set('manufacturers', searchParams.manufacturers)});
  }

  getProductsBySearch(searchParams: SearchProductParams, pageSize: number): Observable<Page<Product>> {
    this.productSearchParams = searchParams;
    return this.getSearchProductList(0, this.productSearchParams, pageSize);
  }

  getProductsByPageNum(currentPage: number, pageSize: number): Observable<Page<Product>> {
    return this.getSearchProductList(currentPage, this.productSearchParams, pageSize);
  }

  getProductById(id: string): Observable<Product> {
    return this.http.get<Product>(`${baseUrl}/${id}`);
  }

  deleteProduct(id: string) : Observable<Object> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  createProduct(product: Product): Observable<Object> {
    return this.http.post(`${baseUrl}`, product);
  }

  editProduct(product: Product): Observable<Object>{
    return this.http.put(`${baseUrl}/${product.id}`, product);
  }
}
