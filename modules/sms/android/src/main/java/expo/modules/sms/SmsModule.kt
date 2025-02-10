package expo.modules.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import android.telephony.SmsMessage
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import expo.modules.kotlin.events.EventEmitter

class SmsModule : Module() {

    private lateinit var smsReceiver: SmsReceiver

    override fun definition() = ModuleDefinition {
        Name("Sms")

        Events("onSmsReceived")

        AsyncFunction("sendSMS") { phoneNumber: String, message: String ->
            try {
                val fixedPhoneNumber =
                    if (!phoneNumber.startsWith("+")) {
                        "+$phoneNumber"
                    } else {
                        phoneNumber
                    }

                val smsManager = android.telephony.SmsManager.getDefault()
                smsManager.sendTextMessage(fixedPhoneNumber, null, message, null, null)
            } catch (e: Exception) {
                throw Exception("Failed to send SMS", e)
            }
        }

        AsyncFunction("callNumber") { phoneNumber: String ->
            try {
                val intent = Intent(Intent.ACTION_CALL)
                intent.data = Uri.parse("tel:$phoneNumber")
                appContext.reactContext?.startActivity(intent)
            } catch (e: Exception) {
                throw Exception("Failed to call number", e)
            }
        }

        AsyncFunction("readSMS") {
            appContext.reactContext?.let { readSms(it) } ?: throw Exception("Context is null")
        }

        OnCreate {
            smsReceiver = SmsReceiver().apply { this.module = this@SmsModule }
            val intentFilter = IntentFilter("android.provider.Telephony.SMS_RECEIVED")
            appContext.reactContext?.registerReceiver(smsReceiver, intentFilter)
        }

        OnDestroy {
            appContext.reactContext?.unregisterReceiver(smsReceiver)
        }
    }

    private fun readSms(context: Context): List<String> {
        val smsList = mutableListOf<String>()
        val uri = Uri.parse("content://sms/inbox")
        val cursor = context.contentResolver.query(uri, null, null, null, null)

        cursor?.use {
            if (it.moveToFirst()) {
                do {
                    val address = it.getString(it.getColumnIndex("address"))
                    val body = it.getString(it.getColumnIndex("body"))
                    val date = it.getString(it.getColumnIndex("date"))
                    val json = "{ \"address\": \"$address\", \"body\": \"$body\", \"date\": $date }"
                    smsList.add(json)
                } while (it.moveToNext())
            }
        }
        return smsList
    }
}
