import * as React from 'react';

import { SmsViewProps } from './Sms.types';

export default function SmsView(props: SmsViewProps) {
  return (
    <div>
      <iframe
        style={{ flex: 1 }}
        src={props.url}
        onLoad={() => props.onLoad({ nativeEvent: { url: props.url } })}
      />
    </div>
  );
}
