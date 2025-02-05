// Reexport the native module. On web, it will be resolved to SmsModule.web.ts
// and on native platforms to SmsModule.ts
// export { default } from './src/SmsModule';


import Sms from './src/SmsModule';

export const sendSms = (message: string): string => {
    return Sms.hello();
};