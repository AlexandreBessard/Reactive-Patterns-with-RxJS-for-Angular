import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';
import { Recipe } from '../core/model/recipe.model';
import { map } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent implements OnInit {

  // all recipes, stream data, emit new value
  recipes$ = this.service.recipes$;
  /* The readonly stream */
  // when filter emits new value, the recipes list should be updated accordingly
  filterRecipesAction$ = this.service.filterRecipesAction$;

  filtredRecipes$ =
      // combine the latest values from two observables, recipes$ and filterRecipesAction$
      // This means that whenever either this.recipes$ or
      // this.filterRecipesAction$ emits a new value, the combineLatest will emit an array
      // containing the latest values from both observables.
      combineLatest([this.recipes$, this.filterRecipesAction$])
    .pipe(
        // array contains 2 elements coming from recipes$ and filterRecipesAction$
    map(([recipes, filter]: [Recipe[], Recipe]) => {
      // filtering recipes array based on whether their titles contain the text specified in the 'filter' object
      // The filter() method creates a shallow copy  of a portion of a given array,
      return recipes.filter(recipe => recipe.title?.toLowerCase()
          // return index of the first occurrence
      .indexOf(filter?.title?.toLowerCase() ?? '') != -1)
    })
  );

  constructor(private service: RecipesService) {
  }

  ngOnInit(): void {
  }

  onRating(event: any, recipe: Recipe) {
    console.log(event.value)
  }

  onCancelRating(recipe: Recipe) {
    console.log(recipe)
  }
  editRecipe(recipe: Recipe) {
    console.log(recipe)
  }


}
