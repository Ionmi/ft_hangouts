// SmsReceiver.kt
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.telephony.SmsMessage
import org.json.JSONObject

class SmsReceiver : BroadcastReceiver() {
    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == "android.provider.Telephony.SMS_RECEIVED") {
            val bundle = intent.extras ?: return
            val pdus = bundle.get("pdus") as? Array<*> ?: return

            for (pdu in pdus) {
                val smsMessage = SmsMessage.createFromPdu(pdu as ByteArray)
                val sender = smsMessage.displayOriginatingAddress
                val messageBody = smsMessage.messageBody

                // Notificar al módulo Expo
                notifyExpoOfSms(context, sender, messageBody)
            }
        }
    }

    private fun notifyExpoOfSms(context: Context, sender: String, messageBody: String) {
        try {
            val data = JSONObject().apply {
                put("sender", sender)
                put("message", messageBody)
            }

            // Emitir evento hacia Expo
            val moduleRegistry = expo.modules.core.ModuleRegistryHolder.getModuleRegistry(context)
            val smsModule = moduleRegistry?.getModule("SmsModule")
            smsModule?.emitEvent("smsReceived", data.toString())
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }
}