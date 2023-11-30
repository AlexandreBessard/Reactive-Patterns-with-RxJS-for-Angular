import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, tap} from 'rxjs';
import { Recipe } from '../model/recipe.model';
import { environment } from 'src/environments/environment';
const BASE_PATH = environment.basePath

@Injectable({
  providedIn: 'root'
})

export class RecipesService {

  recipes$ = this.http.get<Recipe[]>(`${BASE_PATH}/recipes`).pipe(
      tap(() => console.log('GET request executed for recipes'))
  );

  // Read-only stream
  private filterRecipeSubject = new BehaviorSubject<Recipe>(
      // initial value is emitted to any subscribers when they subscribe to the observable
      // hold a current value
      // empty object
      {title: '' });
/*
This is a common pattern in RxJS when you want to expose an observable externally but restrict
certain operations that are available on the original subject, like modifying its value.
 */
  filterRecipesAction$ = this.filterRecipeSubject.asObservable();

  constructor(private http: HttpClient) { }

  updateFilter(criteria: Recipe) {
    this.filterRecipeSubject.next(criteria);
  }
}

