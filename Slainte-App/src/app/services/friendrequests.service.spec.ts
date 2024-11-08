import { TestBed } from '@angular/core/testing';

import { FriendrequestsService } from './friendrequests.service';

describe('FriendrequestsService', () => {
  let service: FriendrequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FriendrequestsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
