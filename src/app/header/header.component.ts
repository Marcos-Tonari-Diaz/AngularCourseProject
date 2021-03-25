import { Component, OnInit, EventEmitter, Output, OnDestroy} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { DataStorageService } from '../shared/data-storage.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated = false;
  private userSub: Subscription;

  constructor(
    private dataStoreraService: DataStorageService,
    private authService: AuthService,
    ) { }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(
      (user)=>{
        this.isAuthenticated = !user ? false:true
      }
    )
  }

  onSaveData(){
    this.dataStoreraService.storeRecipes();
  }

  onFetchData(){
    this.dataStoreraService.fetchRecipes().subscribe();
  }

  onLogout(){
    this.authService.logout()
  }

  ngOnDestroy(){
    this.userSub.unsubscribe()
  }

}
