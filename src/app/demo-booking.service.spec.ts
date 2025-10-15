import { TestBed } from '@angular/core/testing';

import { DemoBookingService } from './services/vera01/demo-booking.service';

describe('DemoBookingService', () => {
  let service: DemoBookingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoBookingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
