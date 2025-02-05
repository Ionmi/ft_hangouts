// SmsModule.kt
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.views.ExpoView
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.core.interfaces.ReactContextBaseJavaModule
import expo.modules.core.Promise
import expo.modules.core.interfaces.ExpoMethod
import com.facebook.react.bridge.WritableMap
import com.facebook.react.bridge.Arguments

class SmsModule : Module() {
    override fun definition() = ModuleDefinition {
        Name("SmsModule")

        AsyncFunction("sendSms") { phoneNumber: String, message: String, promise: Promise ->
            try {
                sendSms(phoneNumber, message)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("SEND_SMS_ERROR", e.message)
            }
        }

        Function("emitEvent") { eventName: String, payload: String ->
            reactContext
                ?.getJSModule(com.facebook.react.modules.deviceinfo.DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, payload)
        }
    }

    private fun sendSms(phoneNumber: String, message: String) {
        val smsManager = SmsManager.getDefault()
        smsManager.sendTextMessage(phoneNumber, null, message, null, null)
    }
}

@ExpoMethod
fun sendSms(phoneNumber: String, message: String, promise: Promise) {
    try {
        val smsSender = SmsSender()
        val success = smsSender.sendSms(phoneNumber, message, reactContext!!)
        promise.resolve(success)
    } catch (e: Exception) {
        promise.reject("SEND_SMS_ERROR", e.message)
    }
}