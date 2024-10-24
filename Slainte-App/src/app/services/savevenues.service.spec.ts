import { TestBed } from '@angular/core/testing';

import { SavevenuesService } from './savevenues.service';

describe('SavevenuesService', () => {
  let service: SavevenuesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SavevenuesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
