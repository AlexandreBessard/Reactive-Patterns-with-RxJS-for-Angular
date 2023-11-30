import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { RecipesService } from '../core/services/recipes.service';

@Component({
  selector: 'app-recipes-list',
  templateUrl: './recipes-list.component.html',
  styleUrls: ['./recipes-list.component.scss'],
  // Angular will only run the change detector when the following occurs:
  // • Condition 3: A bound observable via the async pipe emits a new value.
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RecipesListComponent implements OnInit {

  // subscribe using async from the template
  recipes$ = this.service.recipes$;

  constructor(private service: RecipesService) { }

  ngOnInit(): void {
  }



}
