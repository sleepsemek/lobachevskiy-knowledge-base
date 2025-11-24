import {Component, EventEmitter, Input, Output, signal, computed, inject, OnInit, OnChanges} from '@angular/core';
import { UpdateUser, User } from '../../../entities/user/user.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { FqDialogComponent } from '../../../shared/ui/fq-dialog/fq-dialog.component';
import { FqButtonComponent } from '../../../shared/ui/fq-button/fq-button.component';
import { FqInputComponent } from '../../../shared/ui/fq-input/fq-input.component';
import { FqSelect } from '../../../shared/ui/fq-select/fq-select.component';
import {DepartmentService} from '../../../core/services/department.service';

@Component({
  selector: 'app-edit-user-dialog',
  imports: [
    FqDialogComponent,
    FormsModule,
    FqButtonComponent,
    ReactiveFormsModule,
    FqInputComponent,
    FqSelect
  ],
  templateUrl: './edit-user-dialog.component.html',
  styleUrl: './edit-user-dialog.component.scss',
})
export class EditUserDialogComponent implements OnInit, OnChanges {
  @Input() user: User | null = null;
  @Input() open = false;
  @Output() save = new EventEmitter<UpdateUser>();
  @Output() closed = new EventEmitter<void>();
  @Input() saving: boolean = false;

  readonly departmentOptions = computed(() =>
    this.departments().map(dept => ({
      id: dept.id,
      name: dept.name
    }))
  );

  ngOnInit() {
    this.departmentService.loadDepartments().subscribe();
  }

  form: FormGroup;
  private departmentService = inject(DepartmentService);

  readonly departments = this.departmentService.departments;
  readonly loadingDepartments = this.departmentService.loadingDepartments;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      middle_name: [''],
      phone: ['', Validators.required],
      department_id: ['', Validators.required],
    });
  }

  ngOnChanges(): void {
    if (this.user) {
      this.form.patchValue({
        first_name: this.user.first_name,
        last_name: this.user.last_name,
        middle_name: this.user.middle_name,
        phone: this.user.phone,
        department_id: this.user.department_id,
      });
    }
  }

  submit(): void {
    if (this.form.valid) {
      this.save.emit(this.form.value as UpdateUser);
    }
  }
}
