import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterState, RouterStateSnapshot } from "@angular/router";
import { DataStorageService } from "../shared/data-storage.service";
import { Recipe } from "./recipe.model";
import { RecipeService } from "./recipes.service";

@Injectable({providedIn: 'root'})
export class RecipesResolverService implements Resolve<Recipe[]>{
    constructor(private dataStoreraService: DataStorageService, private recipeService: RecipeService) {}

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        const recipes = this.recipeService.getRecipes()
        if(recipes.length===0){
            return this.dataStoreraService.fetchRecipes();
        }
        else{
            return recipes;
        }
    }

}