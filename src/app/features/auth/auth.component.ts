import {Component, signal, computed, inject, OnInit} from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ValidationService } from '../../core/services/validation.service';
import { FqButtonComponent } from '../../shared/ui/fq-button/fq-button.component';
import { FqInputComponent } from '../../shared/ui/fq-input/fq-input.component';
import {AuthResponse, LoginRequest, RegisterRequest} from '../../entities/user/user.model';
import {
  SegmentedControlComponent,
  SegmentedControlOption
} from '../../shared/ui/fq-segmented-control/fq-segmented-control.component';
import {Department} from '../../entities/departments/department.model';
import {ApiService} from '../../core/services/api.service';
import {environment} from '../../../environments/environment';
import {FqSelect} from '../../shared/ui/fq-select/fq-select.component';
import {DepartmentService} from '../../core/services/department.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    FqButtonComponent,
    FqInputComponent,
    SegmentedControlComponent,
    FqSelect,
  ],
  templateUrl: 'auth.component.html',
  styleUrl: 'auth.component.scss',
})
export class AuthComponent implements OnInit {
  private departmentService: DepartmentService = inject(DepartmentService);
  readonly isLoginMode = signal<boolean>(true);
  readonly submitted = signal<boolean>(false);
  readonly departments = this.departmentService.departments;
  readonly loadingDepartments = this.departmentService.loadingDepartments;

  readonly loginForm: FormGroup;
  readonly registerForm: FormGroup;

  readonly currentForm = computed(() =>
    this.isLoginMode() ? this.loginForm : this.registerForm
  );

  readonly authModeOptions: SegmentedControlOption[] = [
    { value: 'login', label: 'Авторизация' },
    { value: 'register', label: 'Регистрация' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
  ) {
    this.loginForm = this.createLoginForm();
    this.registerForm = this.createRegisterForm();
  }

  ngOnInit() {
    this.departmentService.loadDepartments().subscribe();
  }

  private createLoginForm(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  private createRegisterForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      middleName: [''],
      department_id: [null, [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    }, {
      validators: ValidationService.passwordsMatchValidator('password', 'confirmPassword')
    });
  }

  onAuthModeChange(mode: string): void {
    const shouldBeLoginMode = mode === 'login';
    if (shouldBeLoginMode !== this.isLoginMode()) {
      this.toggleMode();
    }
  }

  toggleMode(): void {
    this.isLoginMode.set(!this.isLoginMode());
    this.submitted.set(false);

    this.currentForm().markAsPristine();
    this.currentForm().markAsUntouched();
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (this.currentForm().invalid) {
      this.markAllAsTouched();
      return;
    }

    if (this.isLoginMode()) {
      this.login();
    } else {
      this.register();
    }
  }

  private login(): void {
    const credentials: LoginRequest = {
      email: this.loginForm.get('email')?.value,
      password: this.loginForm.get('password')?.value
    };

    this.authService.login(credentials).subscribe({
      next: (response: AuthResponse) => {
        this.handleAuthSuccess(response);
      },
      error: (error) => {
        this.submitted.set(false)
      }
    });
  }

  private register(): void {
    const registerData: RegisterRequest = {
      first_name: this.registerForm.get('firstName')?.value,
      middle_name: this.registerForm.get('middleName')?.value,
      last_name: this.registerForm.get('lastName')?.value,
      department_id: this.registerForm.get('department_id')?.value,
      email: this.registerForm.get('email')?.value,
      phone: this.registerForm.get('phone')?.value,
      password: this.registerForm.get('password')?.value,
      password_confirm: this.registerForm.get('confirmPassword')?.value,
    };

    this.authService.register(registerData).subscribe({
      next: (response: AuthResponse) => {
        this.handleAuthSuccess(response);
      },
      error: (error) => {
        this.submitted.set(false)
      }
    });
  }

  private handleAuthSuccess(response: AuthResponse): void {
    this.router.navigate(['/']);
  }

  private markAllAsTouched(): void {
    Object.keys(this.currentForm().controls).forEach(key => {
      this.currentForm().get(key)?.markAsTouched();
    });
  }
}
