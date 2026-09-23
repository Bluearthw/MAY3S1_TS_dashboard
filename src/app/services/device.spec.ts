import { TestBed } from '@angular/core/testing';
import { DeviceService } from './device';
import { firstValueFrom } from 'rxjs';

describe('DeviceService', () => {
  let service: DeviceService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DeviceService]
    });
    service = TestBed.inject(DeviceService);
  });

  it('should toggle a device from ONLINE to OFFLINE', async () => {
    const targetId = 'enc-01';

    // 1. Trigger the state change
    service.toggleDeviceStatus(targetId);

    // 2. Await the latest emitted array from the stream
    const devices = await firstValueFrom(service.devices$);
    const targetDevice = devices.find((d) => d.id === targetId);

    // 3. Assertions
    expect(targetDevice).toBeDefined();
    expect(targetDevice?.status).toBe('OFFLINE');
  });
});