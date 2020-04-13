import { TestBed } from '@angular/core/testing';

import { CardsGeneratorService } from './cards-generator.service';

describe('CardsGeneratorService', () => {
  let service: CardsGeneratorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsGeneratorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
