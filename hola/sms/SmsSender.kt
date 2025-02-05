// SmsSender.kt
import android.telephony.SmsManager

class SmsSender {
    fun sendSms(phoneNumber: String, message: String, context: Context): Boolean {
        return try {
            val smsManager = SmsManager.getDefault()
            smsManager.sendTextMessage(phoneNumber, null, message, null, null)
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }
}