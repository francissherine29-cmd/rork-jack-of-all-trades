package com.rork.jackofalltrades.data

import kotlinx.serialization.Serializable

/** A service category offered on the island, e.g. Landscaping or Taxi & Transport. */
@Serializable
data class ServiceCategory(
    val id: String,
    val name: String,
    val description: String,
    /** Icon key mapped to a Material icon in the UI layer. */
    val icon: String,
    /** Hex color used for the icon and category header. */
    val color: String,
    /** Light hex color used for the icon chip background. */
    val bgLight: String,
)

@Serializable
data class SxmArea(
    val id: String,
    val name: String,
    val zone: String,
)

@Serializable
data class ArrivalTime(
    val id: String,
    val name: String,
    val minutes: Int,
)

@Serializable
data class ServiceProvider(
    val id: String,
    val name: String,
    val category: String,
    val rating: Double,
    val reviews: Int,
    val priceRange: String,
    val areas: List<String>,
    val responseTime: String,
    val description: String,
    val phone: String,
    val isAvailable: Boolean,
    val eta: String? = null,
)

@Serializable
enum class BookingStatus {
    UPCOMING, CONFIRMED, COMPLETED, CANCELLED;

    val label: String
        get() = name.lowercase().replaceFirstChar { it.uppercase() }
}

@Serializable
data class Booking(
    val id: String,
    val service: String,
    val provider: String,
    val date: String,
    val time: String,
    val status: BookingStatus = BookingStatus.UPCOMING,
    val from: String? = null,
    val to: String? = null,
    val address: String? = null,
    val price: String,
    val createdAt: Long = System.currentTimeMillis(),
    /** True when created offline and awaiting sync to the backend. */
    val pendingSync: Boolean = false,
)

@Serializable
enum class IdType { ID_CARD, PASSPORT }

/** A provider signup application, including verification documents and the $25 fee state. */
@Serializable
data class ProviderApplication(
    val businessName: String = "",
    val category: String = "",
    val area: String = "",
    val phone: String = "",
    val email: String = "",
    val description: String = "",
    val photoAttached: Boolean = false,
    val idType: IdType = IdType.ID_CARD,
    val idAttached: Boolean = false,
    val licenseAttached: Boolean = false,
    val cardName: String = "",
    val cardNumber: String = "",
    val expiry: String = "",
    val cvc: String = "",
    val cardLast4: String = "",
    val feePaid: Boolean = false,
    val status: ApplicationStatus = ApplicationStatus.PENDING,
    val isAvailable: Boolean = true,
    val submittedAt: Long = 0L,
)

@Serializable
enum class ApplicationStatus { PENDING, APPROVED, REJECTED }
