package com.rork.jackofalltrades.data

import android.content.Context
import androidx.core.content.edit
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json

/** Holds the provider signup application state, persisted on device. */
object ProviderStore {

    private const val PREFS = "jack_of_all_trades"
    private const val KEY_APPLICATION = "provider_application"

    private val json = Json { ignoreUnknownKeys = true }
    private lateinit var prefs: android.content.SharedPreferences

    private val _application = MutableStateFlow<ProviderApplication?>(null)
    val application: StateFlow<ProviderApplication?> = _application.asStateFlow()

    val isRegistered: Boolean
        get() = _application.value?.status == ApplicationStatus.APPROVED

    val hasPendingApplication: Boolean
        get() = _application.value?.status == ApplicationStatus.PENDING

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS, Context.MODE_PRIVATE)
        _application.value = prefs.getString(KEY_APPLICATION, null)?.let { stored ->
            runCatching { json.decodeFromString<ProviderApplication>(stored) }.getOrNull()
        }
    }

    private fun persist() {
        val current = _application.value
        prefs.edit {
            if (current == null) remove(KEY_APPLICATION) else putString(KEY_APPLICATION, json.encodeToString(current))
        }
    }

    /** Submits the application for review after the $25 fee is paid. */
    fun submit(form: ProviderApplication): ProviderApplication {
        val application = form.copy(
            feePaid = true,
            status = ApplicationStatus.PENDING,
            submittedAt = System.currentTimeMillis(),
        )
        _application.value = application
        persist()
        return application
    }

    /** Providers can toggle availability only after approval. */
    fun toggleAvailability() {
        val current = _application.value ?: return
        if (current.status != ApplicationStatus.APPROVED) return
        _application.value = current.copy(isAvailable = !current.isAvailable)
        persist()
    }

    fun resetForTesting() {
        _application.value = null
        persist()
    }
}
