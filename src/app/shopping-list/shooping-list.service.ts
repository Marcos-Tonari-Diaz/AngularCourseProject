import { EventEmitter } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

export class ShoppingListService {
  ingredientsChange = new Subject<Ingredient[]>();
  ingredients : Ingredient[] = [
    new Ingredient('Apple', 5),
    new Ingredient('Grapes', 10)
  ];

  getIngredients(){
      return this.ingredients.slice();
  }

  addIngredient(ingredient: Ingredient){
     this.ingredients.push(ingredient);
     this.ingredientsChange.next(this.ingredients.slice());
  }

  addIngredients(ingredients: Ingredient[]){
    this.ingredients.push(...ingredients);
    this.ingredientsChange.next(this.ingredients.slice());
  }
}