// import { Service } from '@angular/core';

// @Service()
// export class Device {}

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, interval } from 'rxjs';
import { map } from 'rxjs/operators';
import { ControlDevice, DeviceStatus } from '../models/device.model';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {
  // Initial seed list of Barco CTRL nodes
  private initialDevices: ControlDevice[] = [
    {
      id: 'enc-01',
      name: 'Transcoder Node 1 (Auditorium)',
      ipAddress: '192.168.10.45',
      type: 'ENCODER',
      status: 'ONLINE',
      telemetry: { cpuUsage: 34, temperature: 42, bitrateMbps: 850 }
    },
    {
      id: 'dec-02',
      name: 'Display Wall Decoder Alpha',
      ipAddress: '192.168.10.60',
      type: 'DECODER',
      status: 'ONLINE',
      telemetry: { cpuUsage: 68, temperature: 55, bitrateMbps: 1200 }
    },
    {
      id: 'wall-01',
      name: 'Main Video Wall (OverView)',
      ipAddress: '192.168.10.99',
      type: 'DISPLAY_WALL',
      status: 'WARNING',
      telemetry: { cpuUsage: 89, temperature: 78, bitrateMbps: 3400 }
    }
  ];

  // State holder for active devices
  private devicesSubject = new BehaviorSubject<ControlDevice[]>(this.initialDevices);
  
  // Public Observable stream components can subscribe to
  public devices$: Observable<ControlDevice[]> = this.devicesSubject.asObservable();

  constructor() {
    this.startSimulatedTelemetry();
  }

  /**
   * Simulates real-time hardware telemetry updates every 2 seconds
   */
  private startSimulatedTelemetry(): void {
    interval(2000).subscribe(() => {
      const updated = this.devicesSubject.value.map(device => {
        if (device.status === 'OFFLINE') return device;

        // Add slight random fluctuations to metrics
        const cpuDrift = Math.floor(Math.random() * 7) - 3;
        const newCpu = Math.min(100, Math.max(10, device.telemetry.cpuUsage + cpuDrift));
        
        // Dynamic status check based on load/temperature
        let currentStatus: DeviceStatus = 'ONLINE';
        if (newCpu > 80 || device.telemetry.temperature > 70) {
          currentStatus = 'WARNING';
        }

        return {
          ...device,
          status: currentStatus,
          telemetry: {
            ...device.telemetry,
            cpuUsage: newCpu,
            bitrateMbps: Math.max(100, device.telemetry.bitrateMbps + Math.floor(Math.random() * 40 - 20))
          }
        };
      });

      this.devicesSubject.next(updated);
    });
  }

  /**
   * Filter devices by status
   */
  public getDevicesByStatus(status: DeviceStatus): Observable<ControlDevice[]> {
    return this.devices$.pipe(
      map(devices => devices.filter(d => d.status === status))
    );
  }

  /**
   * Toggle a device's power state
   */
  public toggleDeviceStatus(id: string): void {
    const updated = this.devicesSubject.value.map(device => {
      if (device.id === id) {
        const nextStatus: DeviceStatus = device.status === 'OFFLINE' ? 'ONLINE' : 'OFFLINE';
        return { ...device, status: nextStatus };
      }
      return device;
    });
    this.devicesSubject.next(updated);
  }
}