import { Component, ComponentFactoryResolver, OnDestroy, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { AlertComponent } from '../shared/alert/alert.component';
import { PlaceHolder } from '../shared/placeholder/placeholder.directive';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html'
})
export class AuthComponent implements OnDestroy{
  isLoginMode = true;
  isLoading = false;
  error: string = null;
  @ViewChild(PlaceHolder, {static: false}) alertHost: PlaceHolder
  private closeSub: Subscription;

  constructor(
    private authService: AuthService, 
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
    ){}

  onSwitchMode(){
    this.isLoginMode = !this.isLoginMode
  }

  onSubmitAuthForm(form: NgForm){
    if (!form.valid){
      return;
    }
    const email = form.value.email;
    const password = form.value.password;

    this.isLoading = true;

    let authObs: Observable<AuthResponseData>

    if (this.isLoginMode){
      authObs = this.authService.login(email, password)
    }
    else{
      authObs = this.authService.signup(email, password)
    }

    authObs.subscribe(
        (response)=>{
            console.log(response)
            this.isLoading = false;
            this.router.navigate(['/recipes'])
        },
        (error)=>{
            this.error = error
            this.showErrorAlert(error);
            this.isLoading = false;
        }
    )

    form.reset();
  }

  onHandleError(){
    this.error = null;
  }

  private showErrorAlert(message: string){
    const alertComponentFactory = this.componentFactoryResolver.resolveComponentFactory(AlertComponent)
    const hostViewContainerRef = this.alertHost.viewContainerRef
    hostViewContainerRef.clear();

    const compRef = hostViewContainerRef.createComponent(alertComponentFactory);
    compRef.instance.message = message;
    this.closeSub = compRef.instance.close.subscribe(
     ()=>{
       this.closeSub.unsubscribe()
       hostViewContainerRef.clear()
      }
    );

  }

  ngOnDestroy(){
    if (this.closeSub){
      this.closeSub.unsubscribe()
    }
  }
}
