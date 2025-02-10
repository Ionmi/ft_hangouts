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

export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    return SmsModule.sendSMS(phoneNumber, message);
}

export async function callNumber(phoneNumber: string): Promise<boolean> {
    return SmsModule.callNumber(phoneNumber);
}