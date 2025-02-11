import { EventSubscription } from 'expo-modules-core';
import SmsModule from './src/SmsModule';

export type Sms = { address: string; body: string, date: number };

export function addSmsListener(
    eventName: 'onSmsReceived',
    listener: (event: Sms) => void
): EventSubscription {
    return SmsModule.addListener(eventName, listener);
}

export async function readSMS(): Promise<Sms[]> {
    return SmsModule.readSMS()
}

export async function sendSMS(phoneNumber: string, message: string): Promise<boolean> {
    try {
        return SmsModule.sendSMS(phoneNumber, message);
    } catch (error) {
        return false;
    }
}

export async function callNumber(phoneNumber: string): Promise<boolean> {
    return SmsModule.callNumber(phoneNumber);
}