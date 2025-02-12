package expo.modules.sms

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.telephony.SmsMessage
import expo.modules.sms.SmsModule

class SmsReceiver() : BroadcastReceiver() {
    lateinit var module: SmsModule

    constructor(module: SmsModule) : this() {
        this.module = module
    }

    override fun onReceive(context: Context?, intent: Intent?) {
        if (intent?.action == "android.provider.Telephony.SMS_RECEIVED") {
            val bundle = intent.extras
            if (bundle != null) {
                val pdus = bundle.get("pdus") as Array<Any>
                for (pdu in pdus) {
                    val smsMessage = SmsMessage.createFromPdu(pdu as ByteArray)
                    val address = smsMessage.displayOriginatingAddress
                    val messageBody = smsMessage.messageBody
                    val date = smsMessage.timestampMillis
                    val type =  "received"
                    // Asegurar que module está inicializado antes de usarlo
                    if (::module.isInitialized) {
                        module.sendEvent("onSmsReceived", mapOf("address" to address, "body" to messageBody, "date" to date, "type" to type))
                    }
                }
            }
        }
    }
}