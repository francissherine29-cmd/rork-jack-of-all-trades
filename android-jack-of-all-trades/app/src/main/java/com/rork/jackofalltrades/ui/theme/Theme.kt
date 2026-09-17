package com.rork.jackofalltrades.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color

// Brand palette (matches the original app: ocean cyan on soft light surfaces)
val Cyan = Color(0xFF0891B2)
val CyanDark = Color(0xFF0E7490)
val Teal = Color(0xFF0D9488)
val PageBackground = Color(0xFFF8FAFC)
val CardBorder = Color(0xFFF1F5F9)
val TextDark = Color(0xFF0F172A)
val TextMuted = Color(0xFF64748B)
val AccentAmber = Color(0xFFF59E0B)
val SuccessGreen = Color(0xFF22C55E)
val DangerRed = Color(0xFFEF4444)

private val LightColorScheme = lightColorScheme(
    primary = Cyan,
    onPrimary = Color.White,
    secondary = Teal,
    background = PageBackground,
    surface = Color.White,
    onBackground = TextDark,
    onSurface = TextDark,
    surfaceVariant = Color(0xFFF1F5F9),
    onSurfaceVariant = TextMuted,
    outline = Color(0xFFE2E8F0),
)

// The app is designed light-first (cyan hero headers, white cards); keep it light
// regardless of system setting for a consistent brand experience.
private val DarkColorScheme = LightColorScheme

@Composable
fun AppTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    MaterialTheme(
        colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme,
        content = content
    )
}
