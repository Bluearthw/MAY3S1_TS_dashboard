export type DeviceStatus = 'ONLINE' | 'WARNING' | 'OFFLINE';

export interface DeviceTelemetry {
  cpuUsage: number;     // percentage (0-100)
  temperature: number;  // Celsius
  bitrateMbps: number;  // throughput
}

export interface ControlDevice {
  id: string;
  name: string;
  ipAddress: string;
  type: 'ENCODER' | 'DECODER' | 'DISPLAY_WALL';
  status: DeviceStatus;
  telemetry: DeviceTelemetry;
}