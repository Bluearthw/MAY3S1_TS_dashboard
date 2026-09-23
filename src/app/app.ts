import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DeviceService } from './services/device';
import { ControlDevice } from './models/device.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private deviceService = inject(DeviceService);

  devices$: Observable<ControlDevice[]> = this.deviceService.devices$;

  onTogglePower(id: string): void {
    this.deviceService.toggleDeviceStatus(id);
  }
}