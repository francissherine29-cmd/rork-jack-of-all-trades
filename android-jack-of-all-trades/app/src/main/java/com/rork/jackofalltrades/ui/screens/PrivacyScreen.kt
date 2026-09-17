package com.rork.jackofalltrades.ui.screens

import android.content.Intent
import android.net.Uri
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
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
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.AlternateEmail
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.rork.jackofalltrades.ui.theme.Cyan
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

@Composable
fun PrivacyScreen(navController: NavController) {
    val context = LocalContext.current
    val sections = listOf(
        "Data We Collect" to
            "We collect your name, email address, phone number, and booking history. " +
            "Service providers who register also submit verification documents (photo, ID or passport, " +
            "and business license or work permit), which are used only for identity verification.",
        "How We Use Your Data" to
            "Your data is used to connect you with local service providers, process bookings, " +
            "and verify provider identities. We never sell your personal information to third parties.",
        "Location & Areas" to
            "The app shows providers by the St. Maarten areas you select. We do not track your " +
            "location in the background.",
        "Data Storage & Offline Use" to
            "Bookings and preferences are stored on your device so the app works offline. " +
            "Changes made offline are marked as pending and synced when you reconnect.",
        "Account & Data Deletion" to
            "You may request permanent deletion of your account and all associated data at any time " +
            "by emailing us. Requests are processed within 30 days.",
    )

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .background(Color.White)
                .statusBarsPadding()
        ) {
            IconButton(onClick = { navController.popBackStack() }) {
                Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back", tint = TextDark)
            }
            Text("Privacy Policy", fontSize = 18.sp, fontWeight = FontWeight.Bold, color = TextDark)
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            Text(
                "Last updated: September 2026",
                fontSize = 12.sp,
                color = TextMuted,
            )
            Spacer(Modifier.height(16.dp))
            sections.forEach { (title, body) ->
                Card(
                    shape = RoundedCornerShape(16.dp),
                    colors = CardDefaults.cardColors(containerColor = Color.White),
                    elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
                    modifier = Modifier.fillMaxWidth(),
                ) {
                    Column(Modifier.padding(16.dp)) {
                        Text(title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
                        Spacer(Modifier.height(8.dp))
                        Text(body, fontSize = 14.sp, color = TextMuted, lineHeight = 20.sp)
                    }
                }
                Spacer(Modifier.height(12.dp))
            }

            // Deletion request link
            Card(
                onClick = {
                    runCatching {
                        context.startActivity(
                            Intent(
                                Intent.ACTION_SENDTO,
                                Uri.parse("mailto:privacy@jumpstartsxm.com?subject=${Uri.encode("Account & Data Deletion Request")}")
                            )
                        )
                    }.onFailure {
                        android.widget.Toast.makeText(
                            context,
                            "Please email privacy@jumpstartsxm.com",
                            android.widget.Toast.LENGTH_LONG,
                        ).show()
                    }
                },
                shape = RoundedCornerShape(16.dp),
                colors = CardDefaults.cardColors(containerColor = Color(0xFFE0F2FE)),
                elevation = CardDefaults.cardElevation(defaultElevation = 0.dp),
                modifier = Modifier.fillMaxWidth(),
            ) {
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    modifier = Modifier.padding(16.dp)
                ) {
                    Icon(Icons.Outlined.AlternateEmail, contentDescription = null, tint = Cyan, modifier = Modifier.size(20.dp))
                    Spacer(Modifier.width(12.dp))
                    Text(
                        "Request Account & Data Deletion",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.SemiBold,
                        color = Cyan,
                        modifier = Modifier.weight(1f),
                    )
                }
            }

            Spacer(Modifier.height(12.dp))
            Text(
                "Questions? Contact privacy@jumpstartsxm.com",
                fontSize = 13.sp,
                color = TextMuted,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 32.dp),
                textAlign = androidx.compose.ui.text.style.TextAlign.Center,
            )
        }
    }
}
