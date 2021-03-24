import { Component, OnInit, EventEmitter, Output} from '@angular/core';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  constructor(private dataStoreraService: DataStorageService) { }

  ngOnInit(): void {
  }

  onSaveData(){
    this.dataStoreraService.storeRecipes();
  }

  onFetchData(){
    this.dataStoreraService.fetchRecipes().subscribe();
  }

}
