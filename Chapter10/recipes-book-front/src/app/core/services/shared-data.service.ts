import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Recipe } from '../model/recipe.model';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {

  // Multicast the value of the currently selected recipe, which represents the data to be shared
  // default value is an empty object
  private selectedRecipeSubject = new BehaviorSubject<Recipe>({});
  // Read-only mode
  selectedRecipeAction$ = this.selectedRecipeSubject.asObservable();

  updateSelectedRecipe(recipe: Recipe) {
    this.selectedRecipeSubject.next(recipe);
  }

  constructor() { }
}
