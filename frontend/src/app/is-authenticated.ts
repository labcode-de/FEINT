import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {UserService} from './user.service';
import {Injectable} from '@angular/core';
import {Observable} from "rxjs";

@Injectable()
export class IsAuthenticated implements CanActivate {
  constructor(private userService: UserService, private router: Router) {}
  private userServiceAuthenticated(): boolean {
    if(this.userService.isAuthenticated) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
  private getUser (): Promise<boolean> {
    return this.userService.getUser().then(() => {
     return this.userServiceAuthenticated();
    }).catch(() => {
      return this.userServiceAuthenticated()
    })
  }

  isAuthenticated():Promise<boolean> {
    return this.getUser();
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    return this.getUser();
  }
}
