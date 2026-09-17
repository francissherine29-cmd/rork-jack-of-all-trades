package com.rork.jackofalltrades.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.ChevronRight
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.WifiOff
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
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
import androidx.navigation.NavController
import com.rork.jackofalltrades.data.MockData
import com.rork.jackofalltrades.data.ServiceProvider
import com.rork.jackofalltrades.network.NetworkMonitor
import com.rork.jackofalltrades.ui.iconFor
import com.rork.jackofalltrades.ui.navigation.Routes
import com.rork.jackofalltrades.ui.parseHex
import com.rork.jackofalltrades.ui.theme.AccentAmber
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

@Composable
fun CategoryScreen(categoryId: String, navController: NavController) {
    val category = MockData.categoryById(categoryId)
    val isOnline by NetworkMonitor.isOnline.collectAsStateWithLifecycle()
    var selectedArea by remember { mutableStateOf("") }
    var selectedTime by remember { mutableStateOf("") }

    if (category == null) {
        Box(Modifier.fillMaxSize()) { Text("Category not found", Modifier.padding(16.dp)) }
        return
    }

    val accent = parseHex(category.color)
    val providers = MockData.providersByCategory(categoryId)
        .filter { selectedArea.isEmpty() || selectedArea in it.areas }
        .sortedWith(compareByDescending<ServiceProvider> { it.isAvailable }.thenByDescending { it.rating })

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialBackground)
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(accent)
                .statusBarsPadding()
                .padding(bottom = 32.dp)
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 20.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(80.dp)
                        .background(Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(iconFor(category.icon), contentDescription = category.name, tint = Color.White, modifier = Modifier.size(40.dp))
                }
                Spacer(Modifier.height(16.dp))
                Text(category.name, fontSize = 28.sp, fontWeight = FontWeight.ExtraBold, color = Color.White)
                Spacer(Modifier.height(8.dp))
                Text(
                    category.description,
                    fontSize = 15.sp,
                    color = Color.White.copy(alpha = 0.85f),
                )
            }
        }

        // Filters
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .padding(vertical = 16.dp)
        ) {
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 16.dp)) {
                Icon(Icons.Outlined.Place, contentDescription = null, tint = accent, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Filter by Area", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
            }
            Spacer(Modifier.height(10.dp))
            LazyRow(contentPadding = PaddingValues(horizontal = 16.dp)) {
                item { Chip("All Areas", selectedArea.isEmpty(), accent) { selectedArea = "" } }
                items(MockData.areas) { area ->
                    Chip(area.name, selectedArea == area.id, accent) { selectedArea = area.id }
                }
            }
            Spacer(Modifier.height(16.dp))
            Row(verticalAlignment = Alignment.CenterVertically, modifier = Modifier.padding(horizontal = 16.dp)) {
                Icon(Icons.Outlined.Schedule, contentDescription = null, tint = accent, modifier = Modifier.size(18.dp))
                Spacer(Modifier.width(8.dp))
                Text("Response Time", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
            }
            Spacer(Modifier.height(10.dp))
            LazyRow(contentPadding = PaddingValues(horizontal = 16.dp)) {
                item { Chip("Any Time", selectedTime.isEmpty(), accent) { selectedTime = "" } }
                items(MockData.arrivalTimes) { time ->
                    Chip(time.name, selectedTime == time.id, accent) { selectedTime = time.id }
                }
            }
        }

        // Results
        Text(
            "${providers.size} ${if (providers.size == 1) "provider" else "providers"} available",
            fontSize = 14.sp,
            fontWeight = FontWeight.SemiBold,
            color = TextMuted,
            modifier = Modifier.padding(16.dp),
        )

        if (providers.isEmpty()) {
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 60.dp)
            ) {
                Text("No providers found", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextDark)
                Spacer(Modifier.height(8.dp))
                Text(
                    "Try adjusting your filters or check back later",
                    fontSize = 14.sp,
                    color = TextMuted,
                )
            }
        } else {
            providers.forEach { provider ->
                ProviderCard(
                    provider = provider,
                    accent = accent,
                    onClick = { navController.navigate(Routes.provider(provider.id)) },
                )
                Spacer(Modifier.height(12.dp))
            }
        }

        Spacer(Modifier.height(24.dp))
    }
}

private val MaterialBackground = Color(0xFFF8FAFC)

@Composable
private fun Chip(label: String, selected: Boolean, activeColor: Color, onClick: () -> Unit) {
    val bg = if (selected) activeColor else Color(0xFFF1F5F9)
    val border = if (selected) activeColor else Color(0xFFE2E8F0)
    Box(
        modifier = Modifier
            .padding(end = 8.dp)
            .background(bg, RoundedCornerShape(20.dp))
            .border(1.dp, border, RoundedCornerShape(20.dp))
            .clickable(onClick = onClick)
            .padding(horizontal = 14.dp, vertical = 8.dp)
    ) {
        Text(
            label,
            fontSize = 13.sp,
            fontWeight = FontWeight.Medium,
            color = if (selected) Color.White else TextMuted,
        )
    }
}

@Composable
private fun ProviderCard(provider: ServiceProvider, accent: Color, onClick: () -> Unit) {
    Card(
        onClick = onClick,
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF1F5F9)),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.Top) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(56.dp)
                        .background(Color(0xFFE0F2FE), CircleShape)
                ) {
                    Text(provider.name.first().toString(), fontSize = 24.sp, fontWeight = FontWeight.Bold, color = accent)
                }
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(provider.name, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark, modifier = Modifier.weight(1f, fill = false))
                        if (provider.isAvailable) {
                            Spacer(Modifier.width(8.dp))
                            Text(
                                "Available",
                                fontSize = 10.sp,
                                fontWeight = FontWeight.SemiBold,
                                color = Color(0xFF16A34A),
                                modifier = Modifier
                                    .background(Color(0xFFDCFCE7), RoundedCornerShape(12.dp))
                                    .padding(horizontal = 8.dp, vertical = 4.dp),
                            )
                        }
                    }
                    Spacer(Modifier.height(4.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.Star, contentDescription = null, tint = AccentAmber, modifier = Modifier.size(14.dp))
                        Spacer(Modifier.width(4.dp))
                        Text("${provider.rating}", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
                        Spacer(Modifier.width(6.dp))
                        Text("(${provider.reviews} reviews)", fontSize = 13.sp, color = TextMuted)
                    }
                    Spacer(Modifier.height(2.dp))
                    Text("Typically responds in ${provider.responseTime}", fontSize = 12.sp, color = TextMuted)
                }
                Icon(Icons.Outlined.ChevronRight, contentDescription = null, tint = Color(0xFF94A3B8))
            }

            Spacer(Modifier.height(12.dp))
            Box(Modifier.fillMaxWidth().height(1.dp).background(Color(0xFFF1F5F9)))
            Spacer(Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                Icon(Icons.Outlined.Place, contentDescription = null, tint = TextMuted, modifier = Modifier.size(14.dp))
                Text(
                    provider.areas.take(2).joinToString(", ") { MockData.areaName(it) } +
                        if (provider.areas.size > 2) " +${provider.areas.size - 2}" else "",
                    fontSize = 13.sp, color = TextMuted,
                )
                if (provider.isAvailable) {
                    Icon(Icons.Outlined.Schedule, contentDescription = null, tint = accent, modifier = Modifier.size(14.dp))
                    Text(provider.eta.orEmpty(), fontSize = 13.sp, fontWeight = FontWeight.Medium, color = accent)
                }
            }

            Spacer(Modifier.height(12.dp))
            Box(Modifier.fillMaxWidth().height(1.dp).background(Color(0xFFF1F5F9)))
            Spacer(Modifier.height(12.dp))

            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(provider.priceRange, fontSize = 18.sp, fontWeight = FontWeight.ExtraBold, color = accent, modifier = Modifier.weight(1f))
                Button(
                    onClick = onClick,
                    colors = ButtonDefaults.buttonColors(containerColor = accent),
                    shape = RoundedCornerShape(10.dp),
                ) {
                    Text("Book Now", fontSize = 14.sp, fontWeight = FontWeight.Bold)
                }
            }
        }
    }
}
