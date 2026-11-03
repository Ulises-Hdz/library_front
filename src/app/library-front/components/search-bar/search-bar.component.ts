import { Component, inject, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';

export type BookSearchField = 'title' | 'author' | 'category';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [ReactiveFormsModule],
})
export class SearchBarComponent {
  readonly filtersChanged = output<BookFilters>();
  fb = inject(FormBuilder);
  readonly filtersForm = this.fb.nonNullable.group({
    search: '',
    searchBy: 'title' as BookSearchField,
    category: '',
  });

  constructor() {
    this.filtersForm.valueChanges
      .pipe(takeUntilDestroyed())
      .subscribe(() => this.emitFilters());
  }

  clearFilters() {
    this.filtersForm.reset();
  }

  private emitFilters() {
    this.filtersChanged.emit(this.filtersForm.getRawValue());
  }
}

export interface BookFilters {
  search: string;
  searchBy: BookSearchField;
  category: string;
}
