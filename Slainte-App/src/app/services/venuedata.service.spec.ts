import { TestBed } from '@angular/core/testing';

import { VenuedataService } from './venuedata.service';

describe('VenuedataService', () => {
  let service: VenuedataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VenuedataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
