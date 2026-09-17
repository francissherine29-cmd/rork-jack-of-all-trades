package com.rork.jackofalltrades.data

import android.content.Context
import androidx.core.content.edit
import com.rork.jackofalltrades.network.NetworkMonitor
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/** Bookings CRUD with on-device persistence and offline pending-sync flags. */
object BookingsStore {

    private const val PREFS = "jack_of_all_trades"
    private const val KEY_BOOKINGS = "bookings"

    private val json = Json { ignoreUnknownKeys = true }
    private lateinit var prefs: android.content.SharedPreferences

    private val _bookings = MutableStateFlow<List<Booking>>(emptyList())
    val bookings: StateFlow<List<Booking>> = _bookings.asStateFlow()

    val hasPendingSync: Boolean
        get() = _bookings.value.any { it.pendingSync }

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        val stored = prefs.getString(KEY_BOOKINGS, null)
        _bookings.value = if (stored != null) {
            runCatching { json.decodeFromString<List<Booking>>(stored) }.getOrDefault(MockData.defaultBookings)
        } else {
            MockData.defaultBookings
        }
        persist()
    }

    private fun persist() {
        prefs.edit { putString(KEY_BOOKINGS, json.encodeToString(_bookings.value)) }
    }

    /** Creates a booking; flags it pendingSync when created while offline. */
    fun addBooking(
        service: String,
        provider: String,
        date: String,
        time: String,
        price: String,
        from: String? = null,
        to: String? = null,
        address: String? = null,
    ): Booking {
        val booking = Booking(
            id = System.currentTimeMillis().toString(),
            service = service,
            provider = provider,
            date = date,
            time = time,
            price = price,
            from = from,
            to = to,
            address = address,
            pendingSync = !NetworkMonitor.isOnline.value,
        )
        _bookings.value = listOf(booking) + _bookings.value
        persist()
        return booking
    }

    fun cancelBooking(id: String) {
        _bookings.value = _bookings.value.map {
            if (it.id == id) it.copy(status = BookingStatus.CANCELLED, pendingSync = true) else it
        }
        persist()
    }
}
