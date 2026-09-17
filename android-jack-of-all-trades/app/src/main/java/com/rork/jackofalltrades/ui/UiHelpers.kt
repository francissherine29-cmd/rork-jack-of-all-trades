package com.rork.jackofalltrades.ui

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Build
import androidx.compose.material.icons.outlined.CarRental
import androidx.compose.material.icons.outlined.ChildCare
import androidx.compose.material.icons.outlined.CleaningServices
import androidx.compose.material.icons.outlined.ContentCut
import androidx.compose.material.icons.outlined.Construction
import androidx.compose.material.icons.outlined.DirectionsCar
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.LocalShipping
import androidx.compose.material.icons.outlined.Park
import androidx.compose.material.icons.outlined.Pets
import androidx.compose.material.icons.outlined.Pool
import androidx.compose.material.icons.outlined.Restaurant
import androidx.compose.material.icons.outlined.School
import androidx.compose.material.icons.outlined.Settings
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector

/** Maps a category icon key from the data layer to a Material icon. */
fun iconFor(key: String): ImageVector = when (key) {
    "park" -> Icons.Outlined.Park
    "car" -> Icons.Outlined.DirectionsCar
    "childcare" -> Icons.Outlined.ChildCare
    "restaurant" -> Icons.Outlined.Restaurant
    "build" -> Icons.Outlined.Build
    "cleaning" -> Icons.Outlined.CleaningServices
    "pets" -> Icons.Outlined.Pets
    "truck" -> Icons.Outlined.LocalShipping
    "construction" -> Icons.Outlined.Construction
    "home" -> Icons.Outlined.Home
    "car_rental" -> Icons.Outlined.CarRental
    "settings" -> Icons.Outlined.Settings
    "school" -> Icons.Outlined.School
    "cut" -> Icons.Outlined.ContentCut
    "pool" -> Icons.Outlined.Pool
    else -> Icons.Outlined.Home
}

/** Parses a "#RRGGBB" hex string into a Compose [Color]. */
fun parseHex(hex: String): Color = Color(android.graphics.Color.parseColor(hex))
