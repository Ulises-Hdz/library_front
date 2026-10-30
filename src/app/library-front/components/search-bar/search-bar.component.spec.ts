import { TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  it('emits filters when the form changes and on clear', () => {
    const fixture = TestBed.createComponent(SearchBarComponent);
    fixture.detectChanges();
    const component = fixture.componentInstance;
    const emitted: unknown[] = [];
    component.filtersChanged.subscribe((f) => emitted.push(f));

    component.filtersForm.patchValue({ search: 'dune' });
    expect(emitted.at(-1)).toMatchObject({ search: 'dune', searchBy: 'title' });

    component.clearFilters();
    expect(emitted.at(-1)).toEqual({ search: '', searchBy: 'title', category: '' });
  });
});
