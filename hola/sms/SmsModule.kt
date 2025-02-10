import android.Manifest
import android.app.Activity
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.telephony.SmsManager
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.core.Promise
import expo.modules.core.interfaces.ExpoMethod
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.modules.core.DeviceEventManagerModule

class SmsModule(reactContext: ReactApplicationContext) : Module(reactContext) {

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

        AsyncFunction("callNumber") { phoneNumber: String, promise: Promise ->
            try {
                callNumber(phoneNumber)
                promise.resolve(true)
            } catch (e: Exception) {
                promise.reject("CALL_NUMBER_ERROR", e.message)
            }
        }

        Function("emitEvent") { eventName: String, payload: String ->
            reactContext
                ?.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
                ?.emit(eventName, payload)
        }
    }

    private fun callNumber(phoneNumber: String) {
        if (ContextCompat.checkSelfPermission(reactContext, Manifest.permission.CALL_PHONE)
            != PackageManager.PERMISSION_GRANTED) {
            // Permission is not granted, request it
            ActivityCompat.requestPermissions(reactContext as Activity,
                arrayOf(Manifest.permission.CALL_PHONE), REQUEST_CALL_PHONE)
        } else {
            // Permission has already been granted
            val intent = Intent(Intent.ACTION_CALL)
            intent.data = Uri.parse("tel:$phoneNumber")
            reactContext?.startActivity(intent)
        }
    }

    companion object {
        private const val REQUEST_CALL_PHONE = 1
    }

    private fun sendSms(phoneNumber: String, message: String) {
        val smsManager = SmsManager.getDefault()
        smsManager.sendTextMessage(phoneNumber, null, message, null, null)
    }

    @ReactMethod
    fun sendSms(phoneNumber: String, message: String, promise: Promise) {
        try {
            val smsSender = SmsSender()
            val success = smsSender.sendSms(phoneNumber, message, reactContext!!)
            promise.resolve(success)
        } catch (e: Exception) {
            promise.reject("SEND_SMS_ERROR", e.message)
        }
    }
}

class SmsSender {
    fun sendSms(phoneNumber: String, message: String, reactContext: ReactApplicationContext): Boolean {
        val smsManager = SmsManager.getDefault()
        smsManager.sendTextMessage(phoneNumber, null, message, null, null)
        return true
    }
}