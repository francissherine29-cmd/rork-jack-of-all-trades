package com.rork.jackofalltrades

import android.app.Application
import com.rork.jackofalltrades.data.BookingsStore
import com.rork.jackofalltrades.data.ProviderStore
import com.rork.jackofalltrades.network.NetworkMonitor

class App : Application() {
    override fun onCreate() {
        super.onCreate()
        NetworkMonitor.init(this)
        BookingsStore.init(this)
        ProviderStore.init(this)
    }
}
