import { TestBed } from '@angular/core/testing';

import { ProfilenavigationService } from './profilenavigation.service';

describe('ProfilenavigationService', () => {
  let service: ProfilenavigationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfilenavigationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
