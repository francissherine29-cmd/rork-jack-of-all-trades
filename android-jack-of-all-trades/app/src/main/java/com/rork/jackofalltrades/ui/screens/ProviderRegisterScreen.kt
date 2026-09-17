package com.rork.jackofalltrades.ui.screens

import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
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
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.outlined.Badge
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.CloudUpload
import androidx.compose.material.icons.outlined.Face
import androidx.compose.material.icons.outlined.Work
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
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
import androidx.navigation.NavController
import com.rork.jackofalltrades.data.IdType
import com.rork.jackofalltrades.data.MockData
import com.rork.jackofalltrades.data.ProviderApplication
import com.rork.jackofalltrades.data.ProviderStore
import com.rork.jackofalltrades.ui.parseHex
import com.rork.jackofalltrades.ui.theme.Cyan
import com.rork.jackofalltrades.ui.theme.TextDark
import com.rork.jackofalltrades.ui.theme.TextMuted

private const val SIGNUP_FEE_USD = 25

@OptIn(ExperimentalLayoutApi::class)
@Composable
fun ProviderRegisterScreen(navController: NavController) {
    var step by remember { mutableStateOf(1) }
    var form by remember { mutableStateOf(ProviderApplication()) }
    var showSuccess by remember { mutableStateOf(false) }

    val pickPhoto = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) form = form.copy(photoAttached = true)
    }
    val pickId = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) form = form.copy(idAttached = true)
    }
    val pickLicense = rememberLauncherForActivityResult(ActivityResultContracts.PickVisualMedia()) { uri ->
        if (uri != null) form = form.copy(licenseAttached = true)
    }

    val canContinue = when (step) {
        1 -> form.businessName.isNotBlank() && form.category.isNotBlank() && form.area.isNotBlank() &&
            form.phone.isNotBlank() && form.email.contains("@")
        2 -> form.photoAttached && form.idAttached && form.licenseAttached
        3 -> form.cardName.isNotBlank() && form.cardNumber.filter { it.isDigit() }.length >= 15 &&
            form.expiry.length == 5 && form.cvc.length >= 3
        else -> true
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF8FAFC))
    ) {
        // Header
        Row(
            verticalAlignment = Alignment.CenterVertically,
            modifier = Modifier
                .fillMaxWidth()
                .background(Cyan)
                .statusBarsPadding()
        ) {
            IconButton(onClick = {
                if (step > 1) step-- else navController.popBackStack()
            }) {
                Icon(Icons.AutoMirrored.Outlined.ArrowBack, contentDescription = "Back", tint = Color.White)
            }
            Text(
                "Become a Provider",
                fontSize = 18.sp,
                fontWeight = FontWeight.Bold,
                color = Color.White,
                modifier = Modifier.weight(1f),
            )
            Text(
                "Step $step of 4",
                fontSize = 13.sp,
                color = Color.White.copy(alpha = 0.85f),
                modifier = Modifier.padding(end = 16.dp),
            )
        }
        LinearProgressIndicator(
            progress = { step / 4f },
            modifier = Modifier.fillMaxWidth(),
            color = Color.White,
            trackColor = Cyan.copy(alpha = 0.4f),
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(16.dp)
        ) {
            when (step) {
                1 -> BusinessInfoStep(form) { form = it }
                2 -> DocumentsStep(
                    form = form,
                    onPickPhoto = { pickPhoto.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                    onPickId = { pickId.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                    onPickLicense = { pickLicense.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) },
                    onIdTypeChange = { form = form.copy(idType = it) },
                )
                3 -> PaymentStep(form) { form = it }
                4 -> FeeStep()
            }

            Spacer(Modifier.height(24.dp))

            Button(
                onClick = {
                    if (step < 4) {
                        step++
                    } else {
                        ProviderStore.submit(form)
                        showSuccess = true
                    }
                },
                enabled = canContinue,
                shape = RoundedCornerShape(12.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Cyan),
                modifier = Modifier
                    .fillMaxWidth()
                    .height(52.dp),
            ) {
                Text(
                    if (step < 4) "Continue" else "Pay $$SIGNUP_FEE_USD & Submit",
                    fontSize = 16.sp,
                    fontWeight = FontWeight.Bold,
                )
            }
            Spacer(Modifier.height(32.dp))
        }
    }

    if (showSuccess) {
        AlertDialog(
            onDismissRequest = {},
            title = { Text("Application Submitted", fontWeight = FontWeight.Bold) },
            text = {
                Text(
                    "Thanks for applying! Your application and $$SIGNUP_FEE_USD signup fee have been received. " +
                        "We'll review your verification documents and notify you once approved.",
                )
            },
            confirmButton = {
                TextButton(onClick = {
                    showSuccess = false
                    navController.popBackStack()
                }) {
                    Text("Done", color = Cyan, fontWeight = FontWeight.Bold)
                }
            },
        )
    }
}

@Composable
private fun StepCard(title: String, content: @Composable () -> Unit) {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(Modifier.padding(16.dp)) {
            Text(title, fontSize = 16.sp, fontWeight = FontWeight.Bold, color = TextDark)
            Spacer(Modifier.height(16.dp))
            content()
        }
    }
}

@OptIn(ExperimentalLayoutApi::class)
@Composable
private fun BusinessInfoStep(form: ProviderApplication, onChange: (ProviderApplication) -> Unit) {
    StepCard(title = "Business Information") {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            // Fee badge so providers know upfront
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFFEF3C7), RoundedCornerShape(10.dp))
                    .padding(12.dp)
            ) {
                Text(
                    "Annual $$SIGNUP_FEE_USD USD signup fee required at the end of this application.",
                    fontSize = 13.sp,
                    fontWeight = FontWeight.Medium,
                    color = Color(0xFF92400E),
                )
            }

            OutlinedTextField(
                value = form.businessName,
                onValueChange = { onChange(form.copy(businessName = it)) },
                label = { Text("Business name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            Text("Service category", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                MockData.categories.forEach { category ->
                    SelectableChip(
                        label = category.name,
                        selected = form.category == category.id,
                        selectedColor = parseHex(category.color),
                    ) { onChange(form.copy(category = category.id)) }
                }
            }
            Text("Primary area", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
            FlowRow(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
                MockData.areas.forEach { area ->
                    SelectableChip(
                        label = area.name,
                        selected = form.area == area.id,
                        selectedColor = Cyan,
                    ) { onChange(form.copy(area = area.id)) }
                }
            }
            OutlinedTextField(
                value = form.phone,
                onValueChange = { onChange(form.copy(phone = it)) },
                label = { Text("Phone number") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = form.email,
                onValueChange = { onChange(form.copy(email = it)) },
                label = { Text("Email address") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = form.description,
                onValueChange = { onChange(form.copy(description = it)) },
                label = { Text("Describe your services") },
                minLines = 3,
                modifier = Modifier.fillMaxWidth(),
            )
        }
    }
}

@Composable
private fun DocumentsStep(
    form: ProviderApplication,
    onPickPhoto: () -> Unit,
    onPickId: () -> Unit,
    onPickLicense: () -> Unit,
    onIdTypeChange: (IdType) -> Unit,
) {
    StepCard(title = "Verify Your Identity") {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                "Upload clear photos of each document. Applications are reviewed within 2 business days.",
                fontSize = 13.sp,
                color = TextMuted,
            )
            DocumentSlot(
                icon = Icons.Outlined.Face,
                label = "Profile photo",
                attached = form.photoAttached,
                onClick = onPickPhoto,
            )
            Text("ID type", fontSize = 14.sp, fontWeight = FontWeight.SemiBold, color = TextDark)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                SelectableChip(
                    label = "ID Card",
                    selected = form.idType == IdType.ID_CARD,
                    selectedColor = Cyan,
                    modifier = Modifier.weight(1f),
                ) { onIdTypeChange(IdType.ID_CARD) }
                SelectableChip(
                    label = "Passport",
                    selected = form.idType == IdType.PASSPORT,
                    selectedColor = Cyan,
                    modifier = Modifier.weight(1f),
                ) { onIdTypeChange(IdType.PASSPORT) }
            }
            DocumentSlot(
                icon = Icons.Outlined.Badge,
                label = if (form.idType == IdType.ID_CARD) "ID card" else "Passport",
                attached = form.idAttached,
                onClick = onPickId,
            )
            DocumentSlot(
                icon = Icons.Outlined.Work,
                label = "Business license / work permit",
                attached = form.licenseAttached,
                onClick = onPickLicense,
            )
        }
    }
}

@Composable
private fun DocumentSlot(icon: androidx.compose.ui.graphics.vector.ImageVector, label: String, attached: Boolean, onClick: () -> Unit) {
    Row(
        verticalAlignment = Alignment.CenterVertically,
        modifier = Modifier
            .fillMaxWidth()
            .background(
                if (attached) Color(0xFFF0FDF4) else Color(0xFFF8FAFC),
                RoundedCornerShape(12.dp),
            )
            .border(
                1.dp,
                if (attached) Color(0xFF22C55E) else Color(0xFFE2E8F0),
                RoundedCornerShape(12.dp),
            )
            .clickable(onClick = onClick)
            .padding(14.dp)
    ) {
        Icon(
            if (attached) Icons.Outlined.CheckCircle else icon,
            contentDescription = null,
            tint = if (attached) Color(0xFF22C55E) else Cyan,
            modifier = Modifier.size(24.dp),
        )
        Spacer(Modifier.width(12.dp))
        Text(
            if (attached) "$label • attached" else label,
            fontSize = 14.sp,
            fontWeight = FontWeight.Medium,
            color = if (attached) Color(0xFF15803D) else TextDark,
            modifier = Modifier.weight(1f),
        )
        if (!attached) {
            Icon(Icons.Outlined.CloudUpload, contentDescription = null, tint = TextMuted, modifier = Modifier.size(20.dp))
        }
    }
}

@Composable
private fun PaymentStep(form: ProviderApplication, onChange: (ProviderApplication) -> Unit) {
    StepCard(title = "Payment Method") {
        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
            Text(
                "Your card will be charged the $$SIGNUP_FEE_USD signup fee when you submit your application.",
                fontSize = 13.sp,
                color = TextMuted,
            )
            OutlinedTextField(
                value = form.cardName,
                onValueChange = { onChange(form.copy(cardName = it)) },
                label = { Text("Cardholder name") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            OutlinedTextField(
                value = form.cardNumber,
                onValueChange = { onChange(form.copy(cardNumber = it)) },
                label = { Text("Card number") },
                singleLine = true,
                modifier = Modifier.fillMaxWidth(),
            )
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                OutlinedTextField(
                    value = form.expiry,
                    onValueChange = { onChange(form.copy(expiry = it)) },
                    label = { Text("MM/YY") },
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                )
                OutlinedTextField(
                    value = form.cvc,
                    onValueChange = { onChange(form.copy(cvc = it)) },
                    label = { Text("CVC") },
                    singleLine = true,
                    modifier = Modifier.weight(1f),
                )
            }
        }
    }
}

@Composable
private fun FeeStep() {
    Card(
        shape = RoundedCornerShape(16.dp),
        colors = CardDefaults.cardColors(containerColor = Color.White),
        elevation = CardDefaults.cardElevation(defaultElevation = 1.dp),
        modifier = Modifier.fillMaxWidth(),
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Text(
                "$$SIGNUP_FEE_USD",
                fontSize = 48.sp,
                fontWeight = FontWeight.ExtraBold,
                color = Cyan,
            )
            Text(
                "Annual Provider Signup Fee",
                fontSize = 16.sp,
                fontWeight = FontWeight.Bold,
                color = TextDark,
            )
            Spacer(Modifier.height(12.dp))
            Text(
                "This fee keeps the marketplace trusted and verified. It covers identity checks, " +
                    "document review, and your listing for one full year. You'll be charged when you tap " +
                    "\"Pay & Submit\" below.",
                fontSize = 14.sp,
                color = TextMuted,
                lineHeight = 20.sp,
            )
        }
    }
}

@Composable
private fun SelectableChip(
    label: String,
    selected: Boolean,
    selectedColor: Color,
    modifier: Modifier = Modifier,
    onClick: () -> Unit,
) {
    val bg = if (selected) selectedColor else Color(0xFFF1F5F9)
    val border = if (selected) selectedColor else Color(0xFFE2E8F0)
    Box(
        contentAlignment = Alignment.Center,
        modifier = modifier
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
