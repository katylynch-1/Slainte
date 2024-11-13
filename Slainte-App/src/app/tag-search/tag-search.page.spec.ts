import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TagSearchPage } from './tag-search.page';

describe('TagSearchPage', () => {
  let component: TagSearchPage;
  let fixture: ComponentFixture<TagSearchPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TagSearchPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
