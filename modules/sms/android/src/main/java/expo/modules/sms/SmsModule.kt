package expo.modules.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.net.Uri
import com.google.i18n.phonenumbers.NumberParseException
import com.google.i18n.phonenumbers.PhoneNumberUtil
import com.google.i18n.phonenumbers.Phonenumber
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
                val fixedPhoneNumber = if (!phoneNumber.startsWith("+")) {
                    "+$phoneNumber"
                } else {
                    phoneNumber
                }

                android.util.Log.d("SmsModule", "Sending SMS to $fixedPhoneNumber")
                val smsManager = android.telephony.SmsManager.getDefault()
                smsManager.sendTextMessage(fixedPhoneNumber, null, message, null, null)
            } catch (e: Exception) {
                android.util.Log.e("SmsModule", "Failed to send SMS", e)
                throw Exception("Failed to send SMS", e)
            }
        }

        AsyncFunction("callNumber") { phoneNumber: String ->
            android.util.Log.d("SmsModule", "Calling to $phoneNumber")
            try {
                val fixedPhoneNumber = if (!phoneNumber.startsWith("+")) {
                    "+$phoneNumber"
                } else {
                    phoneNumber
                }
                val intent = Intent(Intent.ACTION_CALL)
                intent.data = Uri.parse("tel:$fixedPhoneNumber")
                intent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
                appContext.reactContext?.startActivity(intent)
            } catch (e: Exception) {
                android.util.Log.e("SmsModule", "Failed to call number", e)
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

    private fun readSms(context: Context): List<Map<String, String>> {
        val smsList = mutableListOf<Map<String, String>>()
        val uri = Uri.parse("content://sms/inbox")
        val projection = arrayOf("address", "body", "date")
        val cursor = context.contentResolver.query(uri, projection, null, null, null)

        cursor?.use {
            if (it.moveToFirst()) {
                do {
                    val address = it.getString(it.getColumnIndexOrThrow("address"))
                    val body = it.getString(it.getColumnIndexOrThrow("body"))
                    val date = it.getString(it.getColumnIndexOrThrow("date"))

                    val cleanedAddress = removeCountryCode(address)
                    val smsData = mapOf("address" to cleanedAddress, "body" to body, "date" to date)
                    smsList.add(smsData)
                } while (it.moveToNext())
            }
        }
        return smsList
    }

    private fun removeCountryCode(phoneNumber: String?): String {
        if (phoneNumber.isNullOrEmpty()) return ""

        val phoneUtil = PhoneNumberUtil.getInstance()
        try {
            val numberProto = phoneUtil.parse(phoneNumber, "")
            val nationalNumber = numberProto.nationalNumber
            return nationalNumber.toString()
        } catch (e: NumberParseException) {
            android.util.Log.e("PhoneNumberParse", "Error parsing number: $phoneNumber", e)
            return phoneNumber
        }
    }
}
