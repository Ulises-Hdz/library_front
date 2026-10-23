import { Component, output } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';

export type BookSearchField = 'title' | 'author' | 'category';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  imports: [ReactiveFormsModule],
})
export class SearchBarComponent {
  readonly filtersChanged = output<BookFilters>();
  readonly filtersForm = new FormGroup({
    search: new FormControl('', { nonNullable: true }),
    searchBy: new FormControl<BookSearchField>('title', { nonNullable: true }),
    category: new FormControl('', { nonNullable: true }),
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
