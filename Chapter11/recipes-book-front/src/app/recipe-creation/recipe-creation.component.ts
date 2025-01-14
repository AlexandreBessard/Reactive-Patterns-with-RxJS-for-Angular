import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { RecipesService } from '../core/services/recipes.service';
import * as recipeTags from '../core/model/tags';
import { catchError, concatMap, finalize, switchMap, tap } from 'rxjs/operators';
import { BehaviorSubject, forkJoin, of } from 'rxjs';
import { UploadRecipesPreviewService } from '../core/services/upload-recipes-preview.service';

@Component({
  selector: 'app-recipe-creation',
  templateUrl: './recipe-creation.component.html',
})
export class RecipeCreationComponent {
  counter: number = 0;
  uploadProgress: number=0;

  constructor(private formBuilder: FormBuilder,
              private service: RecipesService,
              private uploadService: UploadRecipesPreviewService) { }

  recipeForm = this.formBuilder.group({
    id: Math.floor(1000 + Math.random() * 9000),
    title: [''],
    ingredients: [''],
    tags: [''],
    cookingTime: [''],
    yield: [''],
    prepTime: [''],
    steps: ['']
  });
  tags = recipeTags.TAGS;
  valueChanges$ = this.recipeForm.valueChanges.pipe(
    concatMap(formValue => this.service.saveRecipe(formValue)),
    catchError(errors => of(errors)),
    tap(result => this.saveSuccess(result))
  );

  // initialized with an empty array
  uploadedFilesSubject$ = new BehaviorSubject<File[]>([]);

  // Stream responsible for doing the bulk upload
  uploadRecipeImages$ = this.uploadedFilesSubject$.pipe(
    // We use switchMap to transform every value emitted by uploadedFilesSubject$ to the Observable that we will build using forkJoin
    switchMap(uploadedFiles => forkJoin(uploadedFiles.map((file: File) =>
      this.uploadService.upload(this.recipeForm.value.id, file).pipe(
        catchError(errors => of(errors)),
        // finalize -> executed every time an Observable completes or errors out (error occurred)
        finalize(() => this.calculateProgressPercentage(++this.counter, uploadedFiles.length))
      ))))
  )
  saveSuccess(result: any) {
    console.log('Saved successfully');
  }

  onUpload(files: File[]) {
    // emit the last value of the uploaded files
    // send the last array of the uploaded files
    this.uploadedFilesSubject$.next(files);
  }

  private calculateProgressPercentage(completedRequests: number, totalRequests: number) {
    this.uploadProgress = (completedRequests/totalRequests)*100;
  }

}
