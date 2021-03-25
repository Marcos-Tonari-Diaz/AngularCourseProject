import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, Subject, throwError } from "rxjs";
import { catchError, tap } from "rxjs/operators";
import { User } from "./user.model";

export interface AuthResponseData {
    kind: string;
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean;
}

@Injectable({providedIn: 'root'})
export class AuthService{
    user = new BehaviorSubject<User>(null);
    private tokenExpirationTimer: any;
    

    constructor(private http: HttpClient, private router: Router){}

    signup(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBD6Un3_Qct_sSbo286dCSVfeqF8ucVNHk',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        )
        .pipe(catchError(this.handleError), 
            tap(
                (resData)=>{
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn,
                    )
                }
            )
        )
    }

    login(email: string, password: string){
        return this.http.post<AuthResponseData>('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBD6Un3_Qct_sSbo286dCSVfeqF8ucVNHk',
        {
                email: email,
                password: password,
                returnSecureToken: true
        }
        )
        .pipe(catchError(this.handleError),
            tap(
                (resData)=>{
                    this.handleAuthentication(
                        resData.email,
                        resData.localId,
                        resData.idToken,
                        +resData.expiresIn
                    )
                }
            )
        )
    }

    private handleError(errorRes: HttpErrorResponse){
        let errorMsg="An unknow error ocurred!"
        if(!errorRes.error || !errorRes.error.error){
            return throwError(errorMsg);
        };
        switch(errorRes.error.error.message){
            case 'EMAIL_EXISTS':
                errorMsg="email exists :("
                break
            case 'EMAIL_NOT_FOUND':
                errorMsg="email not found :("
                break
            case 'INVALID_PASSWORD':
                errorMsg="password does not match :("
                break
        }
        return throwError(errorMsg);
    }

    private handleAuthentication(email: string, userId:string, token: string, expiresIn: number){
        const expirationDate = new Date(new Date().getTime()+ expiresIn*1000)
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
        this.autoLogout(expiresIn*1000)
        localStorage.setItem('userData', JSON.stringify(user))
    }

    logout(){
        this.user.next(null);
        this.router.navigate(['/auth'])
        localStorage.removeItem("userData")
        if (this.tokenExpirationTimer){
            clearTimeout(this.tokenExpirationTimer)
        }
        this.tokenExpirationTimer=null
    }

    autoLogin(){
        const userData: {
            email: string,
            id: string,
            _token: string,
            _tokenExpDate: string,
        }= JSON.parse(localStorage.getItem('userData'))
        if (!userData){
            return;
        }
        const loadedUser = new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpDate))

        // token getter validates the expiration date
        if (loadedUser.token){
            this.user.next(loadedUser)
            const expirationDuration = new Date(userData._tokenExpDate).getTime() - new Date().getTime()

            console.log(new Date(userData._tokenExpDate))
            console.log(userData._tokenExpDate)
            console.log(expirationDuration)
            this.autoLogout(expirationDuration)
        }
    }

    autoLogout(expirationDuration: number){
        console.log(expirationDuration)
        this.tokenExpirationTimer = setTimeout(
            ()=>{
                this.logout()
            }
            , expirationDuration);
    }
}