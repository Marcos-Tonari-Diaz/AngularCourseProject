import { EventEmitter, Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Ingredient } from '../shared/ingredient.model';
import { ShoppingListService } from '../shopping-list/shooping-list.service';
import { Recipe} from './recipe.model'

@Injectable()

export class RecipeService {

  private recipes: Recipe[] = [
    new Recipe(
      'Pizza de Frigideira', 
      'Pizza rapida na frigideira', 
      'https://s2.glbimg.com/JXx-lciBYMgFVgFEn2h0KayIVOY=/0x0:1280x853/924x0/smart/filters:strip_icc()/i.s3.glbimg.com/v1/AUTH_e84042ef78cb4708aeebdf1c68c6cbd6/internal_photos/bs/2020/r/o/FY7dX7RXyoaLtHdCGenw/pizza-de-frigideira.jpeg', 
    [
      new Ingredient('Colher de manteiga', 1),
      new Ingredient('Colher de Sal', 1),
      new Ingredient('Copo de Leite', 1),
      new Ingredient('Chicara de Farinha de Trigo', 2)
    ]),
    new Recipe(
      'Omelete Rapido', 
      'omelete em 4min', 
      'http://www.cozinhandopara2ou1.com.br/wp-content/uploads/2015/07/OmeletePerfeita_CozinhandoPara2ou1.jpg', 
    [
      new Ingredient('Ovos', 2),
      new Ingredient('Colher de Sal', 1),
      new Ingredient('Fatia de Presunto', 1),
      new Ingredient('Fatia de Queijo', 3),
      new Ingredient('Tempero Verde', 1)
    ])
  ];

  constructor(private slService: ShoppingListService){

  }

  getRecipes(){
      // returns a copy
      return this.recipes.slice();
  }

  getRecipe(id: number){
    return this.recipes[id];
  }

  addIngredientsToShoppingList(ingredients: Ingredient[]){
    this.slService.addIngredients(ingredients);
  }

}