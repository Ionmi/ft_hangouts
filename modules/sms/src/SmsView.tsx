import { requireNativeView } from 'expo';
import * as React from 'react';

import { SmsViewProps } from './Sms.types';

const NativeView: React.ComponentType<SmsViewProps> =
  requireNativeView('Sms');

export default function SmsView(props: SmsViewProps) {
  return <NativeView {...props} />;
}
