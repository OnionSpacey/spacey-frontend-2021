import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { endpointUrls } from '../../../environments/endpoint-routes-manager';
import { EmployeeProfileModel } from '../models/employee-profile.model';
import { UserProfile } from '../models/user-profile.model';
import { EditUserProfile } from '../models/edit-user-profile.model';
import { ChangePassword } from '../models/change-password.model';
import { AuthService } from './auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private hostURL = environment.url + endpointUrls.apiPrefix;
  private userInfoURL = this.hostURL + '/profile';
  private editUserURL = this.hostURL + '/profile/edit';
  private employeeInfoURL = this.hostURL + '/profile/employee';
  private changePasswordURL = this.hostURL + '/change-password-save';
  private httpOptions = { observe: 'response' as const };

  constructor(private http: HttpClient, private authService: AuthService) {}

  getEmployeeInfo(): Observable<HttpResponse<EmployeeProfileModel>> {
    return this.http.get<EmployeeProfileModel>(
      this.employeeInfoURL,
      this.httpOptions
    );
  }

  getUserInfo(): Observable<HttpResponse<UserProfile>> {
    return this.http.get<UserProfile>(this.userInfoURL, this.httpOptions);
  }

  editUserInfo(userData: EditUserProfile): Observable<HttpResponse<any>> {
    return this.http.put(this.editUserURL, userData, this.httpOptions);
  }

  changePassword(newPass: ChangePassword): Observable<HttpResponse<any>> {
    return this.http.post(this.changePasswordURL, newPass, this.httpOptions);
  }

  logOut() {
    this.authService.logOut();
  }
}
