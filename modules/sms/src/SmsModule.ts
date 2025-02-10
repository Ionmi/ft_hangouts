import { NativeModule, requireNativeModule } from 'expo';

declare class SmsModule extends NativeModule {
  PI: number;
  hello(): string;
  sendSMS(phoneNumber: string, message: string): Promise<void>;
  readSMS(): Promise<string[]>;
}

// This call loads the native module object from the JSI.
export default requireNativeModule<SmsModule>('Sms');
