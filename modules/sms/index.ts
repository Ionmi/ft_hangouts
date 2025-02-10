// Reexport the native module. On web, it will be resolved to SmsModule.web.ts
// and on native platforms to SmsModule.ts
// export { default } from './src/SmsModule';

import { EventSubscription } from 'expo-modules-core';
import SmsModule from './src/SmsModule';

export type SmsReceivedEvent = { sender: string; message: string };

export function addSmsListener(
    eventName: 'onSmsReceived',
    listener: (event: SmsReceivedEvent) => void
): EventSubscription {
    return SmsModule.addListener(eventName, listener);
}

export async function readSMS(): Promise<string[]> {
    return SmsModule.readSMS();
}