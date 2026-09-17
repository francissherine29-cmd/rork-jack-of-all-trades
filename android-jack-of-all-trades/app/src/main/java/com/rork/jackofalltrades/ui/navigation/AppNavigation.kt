package com.rork.jackofalltrades.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.CalendarMonth
import androidx.compose.material.icons.outlined.Home
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material3.Icon
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.rork.jackofalltrades.ui.screens.BookingsScreen
import com.rork.jackofalltrades.ui.screens.CategoryScreen
import com.rork.jackofalltrades.ui.screens.HomeScreen
import com.rork.jackofalltrades.ui.screens.PrivacyScreen
import com.rork.jackofalltrades.ui.screens.ProfileScreen
import com.rork.jackofalltrades.ui.screens.ProviderDetailScreen
import com.rork.jackofalltrades.ui.screens.ProviderRegisterScreen
import com.rork.jackofalltrades.ui.theme.Cyan

object Routes {
    const val HOME = "home"
    const val BOOKINGS = "bookings"
    const val PROFILE = "profile"
    const val REGISTER = "register"
    const val PRIVACY = "privacy"
    const val CATEGORY = "category/{categoryId}"
    const val PROVIDER = "provider/{providerId}"

    fun category(categoryId: String) = "category/$categoryId"
    fun provider(providerId: String) = "provider/$providerId"
}

private data class Tab(val route: String, val label: String, val icon: ImageVector)

private val tabs = listOf(
    Tab(Routes.HOME, "Home", Icons.Outlined.Home),
    Tab(Routes.BOOKINGS, "Bookings", Icons.Outlined.CalendarMonth),
    Tab(Routes.PROFILE, "Profile", Icons.Outlined.Person),
)

@Composable
fun AppNavigation() {
    val navController = rememberNavController()
    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val showBottomBar = currentRoute in tabs.map { it.route }

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                BottomBar(navController = navController, currentRoute = currentRoute)
            }
        }
    ) { padding ->
        NavHost(
            navController = navController,
            startDestination = Routes.HOME,
            modifier = Modifier.padding(padding),
        ) {
            composable(Routes.HOME) { HomeScreen(navController = navController) }
            composable(Routes.BOOKINGS) { BookingsScreen() }
            composable(Routes.PROFILE) { ProfileScreen(navController = navController) }
            composable(Routes.REGISTER) { ProviderRegisterScreen(navController = navController) }
            composable(Routes.PRIVACY) { PrivacyScreen(navController = navController) }
            composable(Routes.CATEGORY) { backStack ->
                val categoryId = backStack.arguments?.getString("categoryId").orEmpty()
                CategoryScreen(categoryId = categoryId, navController = navController)
            }
            composable(Routes.PROVIDER) { backStack ->
                val providerId = backStack.arguments?.getString("providerId").orEmpty()
                ProviderDetailScreen(providerId = providerId, navController = navController)
            }
        }
    }
}

@Composable
private fun BottomBar(navController: NavHostController, currentRoute: String?) {
    NavigationBar(containerColor = androidx.compose.ui.graphics.Color.White) {
        tabs.forEach { tab ->
            val selected = currentRoute == tab.route
            NavigationBarItem(
                selected = selected,
                onClick = {
                    navController.navigate(tab.route) {
                        popUpTo(navController.graph.findStartDestination().id) { saveState = true }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                icon = { Icon(tab.icon, contentDescription = tab.label) },
                label = { Text(tab.label) },
                colors = NavigationBarItemDefaults.colors(
                    selectedIconColor = Cyan,
                    selectedTextColor = Cyan,
                    indicatorColor = Cyan.copy(alpha = 0.12f),
                ),
            )
        }
    }
}
