import { TestBed } from '@angular/core/testing';

import { EnvironmentSettingService } from './environment-setting.service';

describe('EnvironmentSettingService', () => {
  let service: EnvironmentSettingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvironmentSettingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
