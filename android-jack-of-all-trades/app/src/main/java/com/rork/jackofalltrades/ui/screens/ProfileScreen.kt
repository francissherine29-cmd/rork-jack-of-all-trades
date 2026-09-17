package com.rork.jackofalltrades.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
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
import androidx.compose.material.icons.outlined.Notifications
import androidx.compose.material.icons.outlined.Work
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.ChevronRight
import androidx.compose.material.icons.outlined.CreditCard
import androidx.compose.material.icons.outlined.DeleteOutline
import androidx.compose.material.icons.outlined.HelpOutline
import androidx.compose.material.icons.outlined.HourglassTop
import androidx.compose.material.icons.outlined.Place
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material.icons.outlined.Star
import androidx.compose.material.icons.outlined.Logout
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.Switch
import androidx.compose.material3.SwitchDefaults
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.navigation.NavController
import com.rork.jackofalltrades.data.ApplicationStatus
import com.rork.jackofalltrades.data.ProviderStore
import com.rork.jackofalltrades.ui.navigation.Routes
import com.rork.jackofalltrades.ui.theme.Cyan
import com.rork.jackofalltrades.ui.theme.DangerRed
import com.rork.jackofalltrades.ui.theme.SuccessGreen
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

private val deletionEmail = "privacy@jumpstartsxm.com"

@Composable
fun ProfileScreen(navController: NavController) {
    val application by ProviderStore.application.collectAsStateWithLifecycle()
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
            .verticalScroll(rememberScrollState())
    ) {
        // Header
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .fillMaxWidth()
                .background(Cyan)
                .statusBarsPadding()
                .padding(vertical = 24.dp)
        ) {
            Text("Profile", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = Color.White)
        }

        // Profile card
        Card(
            shape = RoundedCornerShape(16.dp),
            colors = CardDefaults.cardColors(containerColor = Color.White),
            elevation = CardDefaults.cardElevation(defaultElevation = 4.dp),
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp)
                .offset(y = (-24).dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.padding(20.dp)
            ) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(70.dp)
                        .background(Cyan, CircleShape)
                ) {
                    Text("J", fontSize = 28.sp, fontWeight = FontWeight.Bold, color = Color.White)
                }
                Spacer(Modifier.width(16.dp))
                Column(Modifier.weight(1f)) {
                    Text("John Doe", fontSize = 20.sp, fontWeight = FontWeight.Bold, color = TextDark)
                    Text("john.doe@email.com", fontSize = 14.sp, color = TextMuted)
                    Spacer(Modifier.height(8.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Outlined.Star, contentDescription = null, tint = Color(0xFFF59E0B), modifier = Modifier.size(12.dp))
                        Spacer(Modifier.width(6.dp))
                        Text("Member since March 2026", fontSize = 12.sp, color = TextMuted, fontWeight = FontWeight.Medium)
                    }
                }
            }
        }

        Column(Modifier.offset(y = (-12).dp)) {
            // Provider status / become provider
            when {
                application != null && application!!.status == ApplicationStatus.APPROVED -> {
                    ProviderCard(
                        title = "Provider Account",
                        statusText = "Approved",
                        statusColor = SuccessGreen,
                        showAvailability = true,
                    )
                }
                application != null && application!!.status == ApplicationStatus.PENDING -> {
                    ProviderCard(
                        title = "Provider Account",
                        statusText = "Pending Review",
                        statusColor = Color(0xFFF59E0B),
                        showAvailability = false,
                        note = "Your application is under review. We'll notify you once approved.",
                    )
                }
                else -> {
                    Card(
                        onClick = { navController.navigate(Routes.REGISTER) },
                        shape = RoundedCornerShape(16.dp),
                        colors = CardDefaults.cardColors(containerColor = Color.White),
                        border = androidx.compose.foundation.BorderStroke(2.dp, Cyan),
                        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(horizontal = 16.dp),
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            modifier = Modifier.padding(16.dp)
                        ) {
                            Box(
                                contentAlignment = Alignment.Center,
                                modifier = Modifier
                                    .size(48.dp)
                                    .background(Cyan, RoundedCornerShape(12.dp))
                            ) {
                                Icon(Icons.Outlined.Work, contentDescription = null, tint = Color.White, modifier = Modifier.size(24.dp))
                            }
                            Spacer(Modifier.width(12.dp))
                            Column(Modifier.weight(1f)) {
                                Text("Become a Provider", fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
                                Text("Offer your services and earn money", fontSize = 13.sp, color = TextMuted)
                            }
                            Icon(Icons.Outlined.ChevronRight, contentDescription = null, tint = Cyan)
                        }
                    }
                }
            }

            Spacer(Modifier.height(16.dp))

            // Stats
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
            ) {
                Row(modifier = Modifier.padding(vertical = 20.dp)) {
                    Stat("12", "Bookings", Modifier.weight(1f))
                    StatDivider()
                    Stat("4.9", "Rating", Modifier.weight(1f))
                    StatDivider()
                    Stat("3", "Favorites", Modifier.weight(1f))
                }
            }

            Spacer(Modifier.height(20.dp))

            // Menu
            Card(
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
            ) {
                Column {
                    MenuItem(Icons.Outlined.Work, "Saved Services", badge = "3")
                    MenuItem(Icons.Outlined.CreditCard, "Payment Methods")
                    MenuItem(Icons.Outlined.Notifications, "Notifications", badge = "2")
                    MenuItem(Icons.Outlined.Place, "Saved Addresses")
                    MenuItem(Icons.Outlined.Shield, "Security & Privacy") {
                        navController.navigate(Routes.PRIVACY)
                    }
                    MenuItem(Icons.Outlined.HelpOutline, "Help & Support")
                }
            }

            Spacer(Modifier.height(20.dp))

            // Delete account
            Card(
                onClick = { openDeletionEmail(context) },
                shape = RoundedCornerShape(12.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE2E8F0)),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp),
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = androidx.compose.foundation.layout.Arrangement.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 14.dp)
                ) {
                    Icon(Icons.Outlined.DeleteOutline, contentDescription = null, tint = TextMuted, modifier = Modifier.size(18.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Request Account & Data Deletion", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFF475569))
                }
            }

            Spacer(Modifier.height(16.dp))

            // Log out
            Box(
                contentAlignment = Alignment.Center,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .background(Color(0xFFFEE2E2), RoundedCornerShape(12.dp))
                    .clickable { }
                    .padding(vertical = 16.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.Logout, contentDescription = null, tint = Color(0xFFDC2626), modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(8.dp))
                    Text("Log Out", fontSize = 16.sp, fontWeight = FontWeight.SemiBold, color = Color(0xFFDC2626))
                }
            }

            Spacer(Modifier.height(24.dp))
            Text(
                "Version 1.0.0",
                fontSize = 13.sp,
                color = Color(0xFF94A3B8),
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 32.dp),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            )
        }
    }
}

/** Opens the mail app with a prefilled account/data deletion request. */
private fun openDeletionEmail(context: android.content.Context) {
    val subject = Uri.encode("Account & Data Deletion Request")
    val body = Uri.encode(
        "Hello,\n\nI would like to request the permanent deletion of my account and all associated data.\n\n" +
            "Account email: john.doe@email.com\nName: John Doe\n\nThank you."
    )
    runCatching {
        context.startActivity(
            Intent(Intent.ACTION_SENDTO, Uri.parse("mailto:$deletionEmail?subject=$subject&body=$body"))
        )
    }.onFailure {
        android.widget.Toast.makeText(
            context,
            "Please email $deletionEmail to request account deletion.",
            android.widget.Toast.LENGTH_LONG,
        ).show()
    }
}

@Composable
private fun ProviderCard(
    title: String,
    statusText: String,
    statusColor: Color,
    showAvailability: Boolean,
    note: String? = null,
) {
    val application = ProviderStore.application.value
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Row(verticalAlignment = Alignment.CenterVertically) {
                Box(
                    contentAlignment = Alignment.Center,
                    modifier = Modifier
                        .size(48.dp)
                        .background(Color(0xFFE0F2FE), RoundedCornerShape(12.dp))
                ) {
                    Icon(Icons.Outlined.Work, contentDescription = null, tint = Cyan, modifier = Modifier.size(24.dp))
                }
                Spacer(Modifier.width(12.dp))
                Column(Modifier.weight(1f)) {
                    Text(title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
                    Spacer(Modifier.height(6.dp))
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(
                            if (statusText == "Approved") Icons.Outlined.CheckCircle else Icons.Outlined.HourglassTop,
                            contentDescription = null,
                            tint = statusColor,
                            modifier = Modifier.size(12.dp),
                        )
                        Spacer(Modifier.width(4.dp))
                        Text(statusText, fontSize = 12.sp, fontWeight = FontWeight.SemiBold, color = statusColor)
                    }
                }
            }
            if (showAvailability && application != null) {
                Spacer(Modifier.height(12.dp))
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Text("Available for bookings", fontSize = 14.sp, fontWeight = FontWeight.Medium, color = Color(0xFF334155), modifier = Modifier.weight(1f))
                    Switch(
                        checked = application.isAvailable,
                        onCheckedChange = { ProviderStore.toggleAvailability() },
                        colors = SwitchDefaults.colors(checkedTrackColor = Cyan),
                    )
                }
            }
            if (note != null) {
                Spacer(Modifier.height(12.dp))
                Text(note, fontSize = 13.sp, color = TextMuted, lineHeight = 18.sp)
            }
        }
    }
}

@Composable
private fun Stat(value: String, label: String, modifier: Modifier = Modifier) {
    Column(horizontalAlignment = Alignment.CenterHorizontally, modifier = modifier) {
        Text(value, fontSize = 22.sp, fontWeight = FontWeight.ExtraBold, color = TextDark)
        Text(label, fontSize = 13.sp, color = TextMuted, fontWeight = FontWeight.Medium)
    }
}

@Composable
private fun StatDivider() {
    Box(
        Modifier
            .width(1.dp)
            .height(36.dp)
            .background(Color(0xFFE2E8F0))
    )
}

@Composable
private fun MenuItem(icon: ImageVector, label: String, badge: String? = null, onClick: () -> Unit = {}) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(start = 16.dp)
    ) {
        Box(
            contentAlignment = Alignment.Center,
            modifier = Modifier
                .size(36.dp)
                .background(Color(0xFFF0FDFA), RoundedCornerShape(10.dp))
        ) {
            Icon(icon, contentDescription = null, tint = Cyan, modifier = Modifier.size(20.dp))
        }
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .weight(1f)
                .padding(start = 12.dp, end = 16.dp, top = 16.dp, bottom = 16.dp)
        ) {
            Text(label, fontSize = 15.sp, fontWeight = FontWeight.SemiBold, color = TextDark, modifier = Modifier.weight(1f))
            if (badge != null) {
                Text(
                    badge,
                    fontSize = 12.sp,
                    fontWeight = FontWeight.SemiBold,
                    color = DangerRed,
                    modifier = Modifier
                        .background(Color(0xFFFEE2E2), RoundedCornerShape(12.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp),
                )
            }
            Icon(Icons.Outlined.ChevronRight, contentDescription = null, tint = Color(0xFF94A3B8))
        }
    }
}
