import {Component, OnInit, inject, signal, computed} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SearchRequest } from '../../../entities/search/search.model';
import { SearchService } from '../../../core/services/search.service';
import { FqButtonComponent } from '../../../shared/ui/fq-button/fq-button.component';
import { FqInputComponent } from '../../../shared/ui/fq-input/fq-input.component';
import { FqCheckboxComponent } from '../../../shared/ui/fq-checkbox/fq-checkbox.component';
import { FqDateRangePickerComponent } from '../../../shared/ui/fq-datepicker/fq-date-range-picker.component';
import { FqMultiSelect } from '../../../shared/ui/fq-multi-select/fq-multi-select.component';
import {SearchCardComponent} from '../card/search-card.component';
import {FileTypesService} from '../../../core/services/filetypes.service';
import {DepartmentService} from '../../../core/services/department.service';
import {Department} from '../../../entities/departments/department.model';
import {FqCardComponent} from '../../../shared/ui/fq-card/fq-card.component';
import {FqSelect} from '../../../shared/ui/fq-select/fq-select.component';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html',
  styleUrl: './search-page.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FqButtonComponent,
    FqInputComponent,
    FqCheckboxComponent,
    FqDateRangePickerComponent,
    FqMultiSelect,
    NgOptimizedImage,
    SearchCardComponent,
    FqSelect,
  ]
})
export class SearchPageComponent implements OnInit {
  private searchService = inject(SearchService);
  private fb = inject(FormBuilder);
  private departmentService = inject(DepartmentService);
  private fileTypeService = inject(FileTypesService);

  searchForm!: FormGroup;

  isFormInvalid = signal(true);
  lastQuery = signal<string>('');
  isSameQuery = signal(true);

  readonly hasData = computed(() => this.searchService.results().length > 0);
  readonly departments = this.departmentService.departments;
  readonly fileTypes = this.fileTypeService.fileTypes;

  get searchResults() { return this.searchService.results; }
  get isLoading() { return this.searchService.loading; }
  get queryId() { return this.searchService.queryId; }
  get searchSummary() { return this.searchService.summary; }

  readonly transformedFileTypes = computed(() => {
    const types = this.fileTypes()?.types || [];
    return types.map(type => this.mapFileType(type));
  });

  private mapFileType(fileType: string): { label: string; value: string } {
    const extension = fileType.split('/').pop()?.toUpperCase() || fileType;

    return {
      label: extension,
      value: fileType
    };
  }

  ngOnInit(): void {
    this.departmentService.loadDepartments().subscribe();
    this.fileTypeService.loadFileTypes().subscribe();

    this.searchForm = this.fb.group({
      query: ['', [Validators.minLength(5)]],
      dateRange: [null],
      fileTypes: [[]],
      departments: [[]],
      accessLevel: [''],
      only_active: [true],
    });

    this.searchForm.statusChanges.subscribe(status => {
      this.isFormInvalid.set(status !== 'VALID');
    });

    this.searchForm.get('query')?.valueChanges.subscribe(value => {
      this.isSameQuery.set(value === this.lastQuery());
    });
  }

  onSubmit(): void {
    if (this.searchForm.invalid) {
      this.touchAll();
      return;
    }

    this.performSearch();
  }

  performSearch(): void {
    const formValue = this.searchForm.value;

    let date_from = null;
    let date_to = null;

    if (formValue.dateRange && formValue.dateRange.length === 2) {
      date_from = this.formatDate(formValue.dateRange[0]);
      date_to = this.formatDate(formValue.dateRange[1]);
    }

    const selectedFileTypes = formValue.fileTypes || [];

    const selectedDepartmentIds = formValue.departments
      ? formValue.departments.map((dept: Department) => dept.id)
      : [];

    const request: SearchRequest = {
      query: formValue.query,
      date_from: date_from,
      date_to: date_to,
      file_types: selectedFileTypes,
      department_ids: selectedDepartmentIds,
      only_active: formValue.only_active
    };

    this.lastQuery.set(formValue.query);
    this.searchService.search(request);
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private touchAll() {
    Object.values(this.searchForm.controls).forEach(ctrl => ctrl.markAsTouched());
  }
}
