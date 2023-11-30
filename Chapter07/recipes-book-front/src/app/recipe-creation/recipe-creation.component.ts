import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecipesService } from '../core/services/recipes.service';
import * as recipeTags from '../core/model/tags';
import { catchError, concatMap, tap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
})
export class RecipeCreationComponent implements OnInit{

  // Define a form
  recipeForm = this.formBuilder.group({
    // Random identifier, used to be store in the backend
    id: Math.floor(1000 + Math.random() * 9000),
    title: [''],
    ingredients: [''],
    tags: [''],
    imageUrl: [''],
    cookingTime: [''],
    yield: [''],
    prepTime: [''],
    steps: ['']
  });
  tags = recipeTags.TAGS;
  valueChanges$ = this.recipeForm
    // emits an event every time the value of the control changes
    .valueChanges
    .pipe(
      /*
      concatMap will wait for the previous save
      request to return a response and complete before transforming the new form value
      to saveRecipe$ , subscribing to it, and sending a new save request. When all
      inner observables complete, the result stream completes.
       */
    concatMap(formValue =>
      // Save the most recent value from the form
    // inner observable
    // Send to the backend sequentially
      this.service.saveRecipe(formValue)),
    catchError(errors => of(errors)),
    tap(result=>this.saveSuccess(result))
  );

  constructor(private formBuilder: FormBuilder, private service: RecipesService) { }

  ngOnInit(): void {
  }


  saveSuccess(result: any) {
    console.log('Saved successfully');
  }


}
