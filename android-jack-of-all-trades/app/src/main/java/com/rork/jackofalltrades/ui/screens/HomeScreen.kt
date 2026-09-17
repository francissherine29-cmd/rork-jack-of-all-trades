package com.rork.jackofalltrades.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
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
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Schedule
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.WifiOff
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.rork.jackofalltrades.data.MockData
import com.rork.jackofalltrades.network.NetworkMonitor
import com.rork.jackofalltrades.ui.iconFor
import com.rork.jackofalltrades.ui.navigation.Routes
import com.rork.jackofalltrades.ui.parseHex
import com.rork.jackofalltrades.ui.theme.AccentAmber
import com.rork.jackofalltrades.ui.theme.Cyan
import com.rork.jackofalltrades.ui.theme.DangerRed
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

@Composable
fun HomeScreen(navController: NavController) {
    val isOnline by NetworkMonitor.isOnline.collectAsStateWithLifecycle()
    var selectedArea by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("") }
    var selectedTime by androidx.compose.runtime.remember { androidx.compose.runtime.mutableStateOf("") }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(MaterialTheme.colorScheme.background)
            .verticalScroll(rememberScrollState())
    ) {
        HeroSection(isOnline = isOnline)

        FiltersSection(
            selectedArea = selectedArea,
            onAreaSelected = { selectedArea = it },
            selectedTime = selectedTime,
            onTimeSelected = { selectedTime = it },
        )

        CategoriesSection(
            selectedArea = selectedArea,
            selectedTime = selectedTime,
            navController = navController,
        )

        TopRatedSection(navController = navController)

        Spacer(Modifier.height(24.dp))
    }
}

@Composable
private fun HeroSection(isOnline: Boolean) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Cyan)
            .statusBarsPadding()
            .padding(horizontal = 20.dp, vertical = 24.dp)
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                text = "Jack of all Trades",
                color = Color.White,
                fontSize = 28.sp,
                fontWeight = FontWeight.ExtraBold,
                modifier = Modifier.weight(1f),
            )
            if (!isOnline) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier
                        .background(DangerRed.copy(alpha = 0.85f), RoundedCornerShape(12.dp))
                        .padding(horizontal = 10.dp, vertical = 4.dp)
                ) {
                    Icon(
                        Icons.Outlined.WifiOff,
                        contentDescription = "Offline",
                        tint = Color.White,
                        modifier = Modifier.size(12.dp),
                    )
                    Spacer(Modifier.width(4.dp))
                    Text("Offline", color = Color.White, fontSize = 11.sp, fontWeight = FontWeight.SemiBold)
                }
            }
        }
        Spacer(Modifier.height(4.dp))
        Text(
            text = if (isOnline) "Your one-stop app for every service in St. Maarten"
            else "Browsing cached data • Some features limited",
            color = Color.White.copy(alpha = 0.85f),
            fontSize = 15.sp,
            fontWeight = FontWeight.Medium,
        )
        Spacer(Modifier.height(20.dp))
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White, RoundedCornerShape(12.dp))
                .padding(horizontal = 16.dp, vertical = 14.dp)
        ) {
            Icon(Icons.Outlined.Search, contentDescription = null, tint = TextMuted, modifier = Modifier.size(20.dp))
            Spacer(Modifier.width(12.dp))
            Text("What service do you need?", color = Color(0xFF94A3B8), fontSize = 15.sp, fontWeight = FontWeight.Medium)
        }
    }
}

@Composable
private fun FiltersSection(
    selectedArea: String,
    onAreaSelected: (String) -> Unit,
    selectedTime: String,
    onTimeSelected: (String) -> Unit,
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .background(Color.White)
            .padding(vertical = 16.dp)
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            Icon(Icons.Outlined.Place, contentDescription = null, tint = Cyan, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("Select Area", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
        }
        Spacer(Modifier.height(10.dp))
        LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 16.dp)) {
            item { FilterChip(label = "All Areas", selected = selectedArea.isEmpty(), activeColor = Cyan) { onAreaSelected("") } }
            items(MockData.areas) { area ->
                FilterChip(label = area.name, selected = selectedArea == area.id, activeColor = Cyan) {
                    onAreaSelected(area.id)
                }
            }
        }
        Spacer(Modifier.height(16.dp))
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier.padding(horizontal = 16.dp)
        ) {
            Icon(Icons.Outlined.Schedule, contentDescription = null, tint = Cyan, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("When do you need it?", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
        }
        Spacer(Modifier.height(10.dp))
        LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 16.dp)) {
            item { FilterChip(label = "Anytime", selected = selectedTime.isEmpty(), activeColor = Cyan) { onTimeSelected("") } }
            items(MockData.arrivalTimes) { time ->
                FilterChip(label = time.name, selected = selectedTime == time.id, activeColor = Cyan) {
                    onTimeSelected(time.id)
                }
            }
        }
    }
}

@Composable
private fun FilterChip(label: String, selected: Boolean, activeColor: Color, onClick: () -> Unit) {
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
private fun CategoriesSection(
    selectedArea: String,
    selectedTime: String,
    navController: NavController,
) {
    Column(modifier = Modifier.padding(16.dp)) {
        SectionHeader(title = "Browse Services", action = "See All")
        Spacer(Modifier.height(12.dp))
        MockData.categories.chunked(2).forEach { rowCategories ->
            Row(
                horizontalArrangement = Arrangement.spacedBy(12.dp),
                modifier = Modifier.fillMaxWidth()
            ) {
                rowCategories.forEach { category ->
                    Card(
                        onClick = {
                            navController.navigate(Routes.category(category.id))
                        },
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF1F5F9)),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier.weight(1f),
                    ) {
                        Column(modifier = Modifier.padding(16.dp)) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(48.dp)
                                    .background(parseHex(category.bgLight), RoundedCornerShape(12.dp))
                            ) {
                                Icon(
                                    iconFor(category.icon),
                                    contentDescription = category.name,
                                    tint = parseHex(category.color),
                                    modifier = Modifier.size(24.dp),
                                )
                            }
                            Spacer(Modifier.height(12.dp))
                            Text(category.name, fontSize = 15.sp, fontWeight = FontWeight.Bold, color = TextDark)
                            Spacer(Modifier.height(4.dp))
                            Text(
                                category.description,
                                fontSize = 12.sp,
                                color = TextMuted,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                }
                if (rowCategories.size == 1) Spacer(Modifier.weight(1f))
            }
            Spacer(Modifier.height(12.dp))
        }
    }
}

@Composable
private fun TopRatedSection(navController: NavController) {
    val featured = MockData.providers.filter { it.rating >= 4.8 }.take(3)
    Column {
        SectionHeader(title = "Top Rated", action = "View All", modifier = Modifier.padding(horizontal = 16.dp))
        Spacer(Modifier.height(12.dp))
        LazyRow(contentPadding = androidx.compose.foundation.layout.PaddingValues(horizontal = 16.dp)) {
            items(featured, key = { it.id }) { provider ->
                Card(
                    onClick = { navController.navigate(Routes.provider(provider.id)) },
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFF1F5F9)),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier
                        .width(170.dp)
                        .padding(end = 12.dp),
                ) {
                    Column(modifier = Modifier.padding(12.dp)) {
                        Box(
                            contentAlignment = Alignment.Center,
                            modifier = Modifier
                                .fillMaxWidth()
                                .height(80.dp)
                                .background(Color(0xFFE0F2FE), RoundedCornerShape(12.dp))
                        ) {
                            Text(provider.name.first().toString(), fontSize = 32.sp, fontWeight = FontWeight.Bold, color = Cyan)
                        }
                        Spacer(Modifier.height(12.dp))
                        Text(provider.name, fontSize = 14.sp, fontWeight = FontWeight.Bold, color = TextDark, maxLines = 1, overflow = TextOverflow.Ellipsis)
                        Spacer(Modifier.height(4.dp))
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Icon(Icons.Outlined.Star, contentDescription = null, tint = AccentAmber, modifier = Modifier.size(14.dp))
                            Spacer(Modifier.width(4.dp))
                            Text("${provider.rating}", fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
                            Spacer(Modifier.width(4.dp))
                            Text("(${provider.reviews})", fontSize = 12.sp, color = TextMuted)
                        }
                        Spacer(Modifier.height(4.dp))
                        Text(provider.priceRange, fontSize = 13.sp, fontWeight = FontWeight.SemiBold, color = Cyan)
                        if (provider.isAvailable) {
                            Spacer(Modifier.height(8.dp))
                            Text(
                                "Available • ${provider.eta}",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Medium,
                                color = Cyan,
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun SectionHeader(title: String, action: String, modifier: Modifier = Modifier) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = modifier.fillMaxWidth()
    ) {
        Text(title, fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextDark, modifier = Modifier.weight(1f))
        Text(action, fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Cyan)
    }
}
