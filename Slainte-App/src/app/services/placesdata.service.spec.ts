import { TestBed } from '@angular/core/testing';

import { PlacesdataService } from './placesdata.service';

describe('PlacesdataService', () => {
  let service: PlacesdataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlacesdataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
