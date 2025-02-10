const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withSmsReceiver(config) {
  return withAndroidManifest(config, async (config) => {
    let androidManifest = config.modResults.manifest;

    // Add the receiver to the manifest
    const receiver = {
      $: {
        'android:name': 'expo.modules.sms.SmsReceiver',
        'android:permission': 'android.permission.BROADCAST_SMS',
        'android:exported': 'true',
      },
      'intent-filter': [
        {
          $: {
            'android:priority': '999',
          },
          action: [
            {
              $: {
                'android:name': 'android.provider.Telephony.SMS_RECEIVED',
              },
            },
          ],
        },
      ],
    };

    // Ensure the application element exists
    if (!androidManifest.application) {
      androidManifest.application = [{}];
    }

    // Add the receiver to the application element
    if (!androidManifest.application[0].receiver) {
      androidManifest.application[0].receiver = [];
    }
    androidManifest.application[0].receiver.push(receiver);

    return config;
  });
};
