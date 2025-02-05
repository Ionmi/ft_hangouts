import { ConfigPlugin, withAndroidManifest } from "@expo/config-plugins";

const withSmsPermissions: ConfigPlugin = (config) => {
    return withAndroidManifest(config, async (config) => {
        const androidManifest = config.modResults;

        // Agregar permisos si no están ya en el AndroidManifest.xml
        const permissions = [
            "android.permission.RECEIVE_SMS",
            "android.permission.SEND_SMS",
            "android.permission.READ_SMS",
        ];

        permissions.forEach((permission) => {
            if (!androidManifest.manifest["uses-permission"]?.some((p) => p.$["android:name"] === permission)) {
                androidManifest.manifest["uses-permission"] = [
                    ...(androidManifest.manifest["uses-permission"] || []),
                    { $: { "android:name": permission } },
                ];
            }
        });

        // Agregar el BroadcastReceiver
        androidManifest.manifest["receiver"] = [
            ...(androidManifest.manifest["receiver"] || []),
            {
                $: {
                    "android:name": "com.yourpackage.sms.SmsReceiver",
                    "android:exported": "true",
                },
                "intent-filter": [
                    {
                        action: [
                            { $: { "android:name": "android.provider.Telephony.SMS_RECEIVED" } },
                        ],
                    },
                ],
            },
        ];

        return config;
    });
};

export default withSmsPermissions;