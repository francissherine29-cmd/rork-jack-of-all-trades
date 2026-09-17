package com.rork.jackofalltrades.ui.screens

import android.content.Intent
import android.net.Uri
import android.widget.Toast
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ExperimentalLayoutApi
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Favorite
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Message
import androidx.compose.material.icons.outlined.Phone
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.Verified
import androidx.compose.material.icons.outlined.WorkspacePremium
import androidx.compose.material.icons.outlined.EventAvailable
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.rork.jackofalltrades.data.BookingsStore
import com.rork.jackofalltrades.data.MockData
import com.rork.jackofalltrades.ui.parseHex
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

private val priceEstimate = mapOf("$" to 35, "$$" to 75, "$$$" to 120, "$$$$" to 250)

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ProviderDetailScreen(providerId: String, navController: NavController) {
    val provider = MockData.providers.find { it.id == providerId }
    val category = provider?.let { MockData.categoryById(it.category) }
    val context = LocalContext.current
    var isFavorite by remember { mutableStateOf(false) }

    if (provider == null || category == null) {
        Box(Modifier.fillMaxSize()) { Text("Provider not found", Modifier.padding(16.dp)) }
        return
    }

    val accent = parseHex(category.color)

    Box(Modifier.fillMaxSize().background(Color(0xFFF8FAFC))) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
        ) {
            // Header
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(accent)
                    .statusBarsPadding()
                    .padding(horizontal = 16.dp, vertical = 8.dp)
            ) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back", tint = Color.White)
                }
                Spacer(Modifier.weight(1f))
                IconButton(onClick = { isFavorite = !isFavorite }) {
                    Icon(
                        if (isFavorite) Icons.Outlined.Favorite else Icons.Outlined.FavoriteBorder,
                        contentDescription = if (isFavorite) "Unfavorite" else "Favorite",
                        tint = if (isFavorite) Color(0xFFEF4444) else Color.White,
                    )
                }
            }

            // Profile card
            Card(
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .offset(y = (-32).dp),
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(20.dp)
                ) {
                    Box {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .size(80.dp)
                                .background(Color(0xFFE0F2FE), CircleShape)
                        ) {
                            Text(provider.name.first().toString(), fontSize = 32.sp, fontWeight = FontWeight.Bold, color = accent)
                        }
                        if (provider.isAvailable) {
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .align(Alignment.BottomEnd)
                                    .background(Color(0xFF22C55E), CircleShape)
                                    .border(2.dp, Color.White, CircleShape)
                            )
                        }
                    }
                    Spacer(Modifier.width(16.dp))
                    Column(Modifier.weight(1f)) {
                        Text(provider.name, fontSize = 20.sp, fontWeight = FontWeight.ExtraBold, color = TextDark)
                        Spacer(Modifier.height(4.dp))
                        Text(category.name, fontSize = 14.sp, color = TextMuted)
                        Spacer(Modifier.height(8.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Row(
                                verticalAlignment = Alignment.CenterVertically,
                                modifier = Modifier
                                    .background(Color(0xFFF59E0B), RoundedCornerShape(8.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Icon(Icons.Outlined.Star, contentDescription = null, tint = Color.White, modifier = Modifier.size(14.dp))
                                Spacer(Modifier.width(4.dp))
                                Text("${provider.rating}", fontSize = 13.sp, fontWeight = FontWeight.Bold, color = Color.White)
                            }
                            Spacer(Modifier.width(8.dp))
                            Text("(${provider.reviews} reviews)", fontSize = 13.sp, color = TextMuted)
                        }
                    }
                }
            }

            Column(Modifier.offset(y = (-20).dp)) {
                // Quick info
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp),
                ) {
                    Row(modifier = Modifier.padding(vertical = 20.dp)) {
                        QuickInfo(Icons.Outlined.Schedule, provider.responseTime, "Response", accent, Modifier.weight(1f))
                        VerticalDivider()
                        QuickInfo(Icons.Outlined.EventAvailable, provider.eta ?: "N/A", "Arrival", accent, Modifier.weight(1f))
                        VerticalDivider()
                        QuickInfo(Icons.Outlined.WorkspacePremium, provider.priceRange, "Price Range", accent, Modifier.weight(1f))
                    }
                }

                Section("About") {
                    Text(provider.description, fontSize = 15.sp, color = Color(0xFF475569), lineHeight = 24.sp)
                }

                Section("Service Areas") {
                    FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                        provider.areas.forEach { area ->
                            Text(
                                MockData.areaName(area),
                                fontSize = 13.sp,
                                fontWeight = FontWeight.Medium,
                                color = Color(0xFF475569),
                                modifier = Modifier
                                    .background(Color(0xFFF1F5F9), RoundedCornerShape(20.dp))
                                    .padding(horizontal = 14.dp, vertical = 8.dp),
                            )
                        }
                    }
                }

                if (provider.isAvailable && provider.eta != null) {
                    Section("Availability") {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier
                                .fillMaxWidth()
                                .background(Color(0xFFF0FDFA), RoundedCornerShape(12.dp))
                                .padding(16.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(48.dp)
                                    .background(Color.White, RoundedCornerShape(12.dp))
                            ) {
                                Icon(Icons.Outlined.Schedule, contentDescription = null, tint = accent, modifier = Modifier.size(24.dp))
                            }
                            Spacer(Modifier.width(12.dp))
                            Column {
                                Text("Available Now", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
                                Text("Can arrive in ${provider.eta}", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = accent)
                            }
                        }
                    }
                }

                Section("Trust & Safety") {
                    Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                        TrustBadge(Icons.Outlined.Verified, "Verified", Color(0xFF22C55E), Modifier.weight(1f))
                        TrustBadge(Icons.Outlined.WorkspacePremium, "Top Rated", Color(0xFF3B82F6), Modifier.weight(1f))
                        TrustBadge(Icons.Outlined.EventAvailable, "Reliable", Color(0xFF8B5CF6), Modifier.weight(1f))
                    }
                }

                // Contact buttons
                Row(
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 24.dp)
                ) {
                    OutlinedButton(
                        onClick = {
                            Toast.makeText(context, "Messaging coming soon", Toast.LENGTH_SHORT).show()
                        },
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f),
                    ) {
                        Icon(Icons.Outlined.Message, contentDescription = null, tint = accent, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Message", fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = accent)
                    }
                    Button(
                        onClick = {
                            context.startActivity(Intent(Intent.ACTION_DIAL, Uri.parse("tel:${provider.phone}")))
                        },
                        colors = ButtonDefaults.buttonColors(containerColor = accent),
                        shape = RoundedCornerShape(12.dp),
                        modifier = Modifier.weight(1f),
                    ) {
                        Icon(Icons.Outlined.Phone, contentDescription = null, tint = Color.White, modifier = Modifier.size(20.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Call", fontSize = 15.sp, fontWeight = FontWeight.SemiBold)
                    }
                }

                Spacer(Modifier.height(96.dp))
            }
        }

        // Book Now footer
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(Color.White)
                .padding(horizontal = 16.dp, vertical = 16.dp)
        ) {
            Column(Modifier.weight(1f)) {
                Text("Starting from", fontSize = 12.sp, color = TextMuted)
                Text("$${priceEstimate[provider.priceRange] ?: 50}", fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = TextDark)
            }
            Button(
                onClick = {
                    val booking = BookingsStore.addBooking(
                        service = category.name,
                        provider = provider.name,
                        date = "Today",
                        time = "ASAP",
                        price = "$${priceEstimate[provider.priceRange] ?: 50}",
                    )
                    val syncNote = if (booking.pendingSync) " • will sync when online" else ""
                    Toast.makeText(context, "Booked ${provider.name}$syncNote", Toast.LENGTH_LONG).show()
                },
                colors = ButtonDefaults.buttonColors(containerColor = accent),
                shape = RoundedCornerShape(12.dp),
                contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 32.dp, vertical = 14.dp),
            ) {
                Text("Book Now", fontSize = 16.sp, fontWeight = FontWeight.Bold)
            }
        }
    }
}

@Composable
private fun QuickInfo(icon: androidx.compose.ui.graphics.vector.ImageVector, value: String, label: String, accent: Color, modifier: Modifier = Modifier) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, verticalArrangement = Arrangement.spacedBy(6.dp), modifier = modifier) {
        Icon(icon, contentDescription = label, tint = accent, modifier = Modifier.size(20.dp))
        Text(value, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
        Text(label, fontSize = 12.sp, color = TextMuted)
    }
}

@Composable
private fun VerticalDivider() {
    Box(
        Modifier
            .width(1.dp)
            .height(40.dp)
            .background(Color(0xFFE2E8F0))
    )
}

@Composable
private fun Section(title: String, content: @Composable () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 12.dp)
    ) {
        Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextDark)
        Spacer(Modifier.height(12.dp))
        content()
    }
}

@Composable
private fun TrustBadge(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, tint: Color, modifier: Modifier = Modifier) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.Center,
        modifier = modifier
            .background(Color.White, RoundedCornerShape(12.dp))
            .padding(horizontal = 8.dp, vertical = 12.dp)
    ) {
        Icon(icon, contentDescription = null, tint = tint, modifier = Modifier.size(18.dp))
        Spacer(Modifier.width(6.dp))
        Text(label, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF475569))
    }
}
