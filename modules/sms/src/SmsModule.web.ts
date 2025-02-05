import { registerWebModule, NativeModule } from 'expo';

import { ChangeEventPayload } from './Sms.types';

type SmsModuleEvents = {
  onChange: (params: ChangeEventPayload) => void;
}

class SmsModule extends NativeModule<SmsModuleEvents> {
  PI = Math.PI;
  async setValueAsync(value: string): Promise<void> {
    this.emit('onChange', { value });
  }
  hello() {
    return 'Hello world! 👋';
  }
};

export default registerWebModule(SmsModule);
