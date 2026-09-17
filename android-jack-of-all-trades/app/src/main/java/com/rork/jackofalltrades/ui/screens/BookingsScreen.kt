package com.rork.jackofalltrades.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.WifiOff
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import com.rork.jackofalltrades.data.Booking
import com.rork.jackofalltrades.data.BookingStatus
import com.rork.jackofalltrades.data.BookingsStore
import com.rork.jackofalltrades.network.NetworkMonitor
import com.rork.jackofalltrades.ui.theme.Cyan
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

@Composable
fun BookingsScreen() {
    val bookings by BookingsStore.bookings.collectAsStateWithLifecycle()
    val isOnline by NetworkMonitor.isOnline.collectAsStateWithLifecycle()
    var activeTab by remember { mutableStateOf("upcoming") }

    val filtered = bookings.filter {
        if (activeTab == "upcoming") {
            it.status != BookingStatus.COMPLETED && it.status != BookingStatus.CANCELLED
        } else {
            it.status == BookingStatus.COMPLETED
        }
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        // Header
        Row(
            verticalAlignment = Alignment.Bottom,
            modifier = Modifier
                .fillMaxWidth()
                .background(Cyan)
                .statusBarsPadding()
                .padding(horizontal = 20.dp, vertical = 20.dp)
        ) {
            Text(
                "My Bookings",
                fontSize = 24.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Color.White,
                modifier = Modifier.weight(1f),
            )
            if (!isOnline) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(Color.White.copy(alpha = 0.9f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Icon(Icons.Outlined.WifiOff, contentDescription = null, tint = Color(0xFFDC2626), modifier = Modifier.size(12.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Offline", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFDC2626))
                }
            }
        }

        // Tabs
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
        ) {
            TabItem("Upcoming", activeTab == "upcoming", Modifier.weight(1f)) { activeTab = "upcoming" }
            TabItem("Completed", activeTab == "completed", Modifier.weight(1f)) { activeTab = "completed" }
        }

        // Content
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            if (filtered.isEmpty()) {
                Column(
                    horizontalAlignment = Alignment.CenterHorizontally,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(top = 80.dp)
                ) {
                    Box(
                        contentAlignment = Alignment.Center,
                        modifier = Modifier
                            .size(80.dp)
                            .background(Color(0xFFF1F5F9), CircleShape)
                    ) {
                        Icon(Icons.Outlined.CalendarMonth, contentDescription = null, tint = Color(0xFF94A3B8), modifier = Modifier.size(40.dp))
                    }
                    Spacer(Modifier.height(16.dp))
                    Text("No ${activeTab} bookings", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextDark)
                    Spacer(Modifier.height(8.dp))
                    Text(
                        if (activeTab == "upcoming") "Book a service to get started!"
                        else "Your completed bookings will appear here",
                        fontSize = 14.sp,
                        color = TextMuted,
                    )
                }
            } else {
                filtered.forEach { booking ->
                    BookingCard(booking = booking)
                    Spacer(Modifier.height(12.dp))
                }
            }
        }
    }
}

@Composable
private fun TabItem(label: String, selected: Boolean, modifier: Modifier = Modifier, onClick: () -> Unit) {
    Column(
        horizontalAlignment = Alignment.CenterHorizontally,
        modifier = modifier.clickable(onClick = onClick)
    ) {
        Box(Modifier.height(56.dp).padding(top = 16.dp), contentAlignment = Alignment.Center) {
            Text(
                label,
                fontSize = 15.sp,
                fontWeight = FontWeight.SemiBold,
                color = if (selected) Cyan else TextMuted,
            )
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(2.dp)
                .background(if (selected) Cyan else Color.Transparent)
        )
    }
}

@Composable
private fun BookingCard(booking: Booking) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF1F5F9)),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            if (booking.pendingSync) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(Color(0xFFFEF3C7), RoundedCornerShape(8.dp))
                        .padding(horizontal = 8.dp, vertical = 3.dp)
                ) {
                    Icon(Icons.Outlined.WifiOff, contentDescription = null, tint = Color(0xFFD97706), modifier = Modifier.size(10.dp))
                    Spacer(Modifier.width(4.dp))
                    Text("Pending sync", fontSize = 11.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFD97706))
                }
                Spacer(Modifier.height(8.dp))
            }

            Row(verticalAlignment = Alignment.Top) {
                Column(Modifier.weight(1f)) {
                    Text(booking.service, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
                    Text(booking.provider, fontSize = 14.sp, color = TextMuted)
                }
                StatusBadge(booking.status)
            }

            Spacer(Modifier.height(12.dp))
            Box(Modifier.fillMaxWidth().height(1.dp).background(Color(0xFFF1F5F9)))
            Spacer(Modifier.height(12.dp))

            DetailRow(Icons.Outlined.CalendarMonth, booking.date)
            Spacer(Modifier.height(8.dp))
            DetailRow(Icons.Outlined.Schedule, booking.time)
            if (booking.from != null && booking.to != null) {
                Spacer(Modifier.height(8.dp))
                DetailRow(Icons.Outlined.Place, "${booking.from} → ${booking.to}")
            }
            if (booking.address != null) {
                Spacer(Modifier.height(8.dp))
                DetailRow(Icons.Outlined.Place, booking.address)
            }

            Spacer(Modifier.height(12.dp))
            Box(Modifier.fillMaxWidth().height(1.dp).background(Color(0xFFF1F5F9)))
            Spacer(Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(booking.price, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = Cyan, modifier = Modifier.weight(1f))
                if (booking.status == BookingStatus.UPCOMING || booking.status == BookingStatus.CONFIRMED) {
                    TextButton(onClick = { BookingsStore.cancelBooking(booking.id) }) {
                        Text("Cancel", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFDC2626))
                    }
                }
            }
        }
    }
}

@Composable
private fun DetailRow(icon: androidx.compose.ui.graphics.vector.ImageVector, text: String) {
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, tint = TextMuted, modifier = Modifier.size(16.dp))
        Spacer(Modifier.width(8.dp))
        Text(text, fontSize = 14.sp, color = Color(0xFF475569))
    }
}

@Composable
private fun StatusBadge(status: BookingStatus) {
    val (bg, fg) = when (status) {
        BookingStatus.UPCOMING -> Color(0xFFFEF3C7) to Color(0xFFD97706)
        BookingStatus.CONFIRMED -> Color(0xFFD1FAE5) to Color(0xFF059669)
        BookingStatus.COMPLETED -> Color(0xFFF1F5F9) to TextMuted
        BookingStatus.CANCELLED -> Color(0xFFFEE2E2) to Color(0xFFDC2626)
    }
    Text(
        status.label,
        fontSize = 12.sp,
        fontWeight = FontWeight.SemiBold,
        color = fg,
        modifier = Modifier
            .background(bg, RoundedCornerShape(20.dp))
            .padding(horizontal = 10.dp, vertical = 6.dp),
    )
}
