package com.rork.jackofalltrades.data

/** Static catalog data for St. Maarten services. */
object MockData {

    val categories = listOf(
        ServiceCategory("landscaping", "Landscaping", "Lawn care, gardening, tree trimming", "park", "#22C55E", "#DCFCE7"),
        ServiceCategory("taxi", "Taxi & Transport", "Airport transfers, island tours, rides", "car", "#3B82F6", "#DBEAFE"),
        ServiceCategory("babysitting", "Babysitting", "Child care and nanny services", "childcare", "#F472B6", "#FCE7F3"),
        ServiceCategory("food-delivery", "Food Delivery", "Restaurant meals delivered to you", "restaurant", "#F97316", "#FFEDD5"),
        ServiceCategory("home-repair", "Home Repair", "Plumbing, electrical, handyman", "build", "#6366F1", "#E0E7FF"),
        ServiceCategory("cleaning", "Cleaning", "House cleaning and deep cleaning", "cleaning", "#14B8A6", "#CCFBF1"),
        ServiceCategory("pet-care", "Pet Care", "Dog walking, pet sitting, grooming", "pets", "#A855F7", "#F3E8FF"),
        ServiceCategory("moving", "Moving & Hauling", "Furniture moving, deliveries", "truck", "#EAB308", "#FEF9C3"),
        ServiceCategory("construction", "Construction", "Renovations, painting, repairs", "construction", "#78716C", "#F5F5F4"),
        ServiceCategory("property", "Property Care", "Pool maintenance, property management", "home", "#0EA5E9", "#E0F2FE"),
        ServiceCategory("car-rental", "Car Rental", "Rent vehicles for island exploration", "car_rental", "#0D9488", "#CCFBF1"),
        ServiceCategory("mechanic", "Mechanic", "Auto repairs, maintenance, towing", "settings", "#B45309", "#FEF3C7"),
        ServiceCategory("tutoring", "Tutoring", "Academic tutoring, test prep, lessons", "school", "#7C3AED", "#EDE9FE"),
        ServiceCategory("haircare", "Hair Care", "Haircuts, styling, braids, treatments", "cut", "#DB2777", "#FCE7F3"),
        ServiceCategory("pool-service", "Pool Service", "Pool cleaning, maintenance, repairs", "pool", "#0284C7", "#E0F2FE"),
    )

    val areas = listOf(
        SxmArea("philipsburg", "Philipsburg", "Dutch Side"),
        SxmArea("simpson-bay", "Simpson Bay", "Dutch Side"),
        SxmArea("maho", "Maho", "Dutch Side"),
        SxmArea("cupecoy", "Cupecoy", "Dutch Side"),
        SxmArea("cole-bay", "Cole Bay", "Dutch Side"),
        SxmArea("marigot", "Marigot", "French Side"),
        SxmArea("grand-case", "Grand Case", "French Side"),
        SxmArea("orient-bay", "Orient Bay", "French Side"),
        SxmArea("cul-de-sac", "Cul-de-Sac", "French Side"),
        SxmArea("french-quarter", "French Quarter", "French Side"),
        SxmArea("south-reward", "South Reward", "Dutch Side"),
        SxmArea("cay-hill", "Cay Hill", "Dutch Side"),
    )

    val arrivalTimes = listOf(
        ArrivalTime("asap", "ASAP", 0),
        ArrivalTime("15min", "15 min", 15),
        ArrivalTime("30min", "30 min", 30),
        ArrivalTime("1hour", "1 hour", 60),
        ArrivalTime("2hours", "2 hours", 120),
        ArrivalTime("today", "Today", 480),
        ArrivalTime("tomorrow", "Tomorrow", 1440),
    )

    fun categoryById(id: String): ServiceCategory? = categories.find { it.id == id }

    fun areaName(id: String): String = areas.find { it.id == id }?.name ?: id.replace('-', ' ')

    fun providersByCategory(categoryId: String): List<ServiceProvider> =
        providers.filter { it.category == categoryId }

    val providers = listOf(
        // Landscaping
        ServiceProvider("1", "Island Gardens", "landscaping", 4.8, 124, "$$",
            listOf("simpson-bay", "maho", "cupecoy", "cole-bay"), "15 min",
            "Professional landscaping services for villas and commercial properties. Lawn mowing, tree trimming, garden design.",
            "+1-721-555-0101", true, "20 min"),
        ServiceProvider("2", "Tropical Trim", "landscaping", 4.6, 89, "$",
            listOf("philipsburg", "cay-hill", "south-reward"), "30 min",
            "Affordable lawn care and maintenance. Weekly or one-time services available.",
            "+1-721-555-0102", true, "45 min"),
        // Taxi
        ServiceProvider("3", "SXM Rides", "taxi", 4.9, 342, "$$",
            listOf("philipsburg", "simpson-bay", "maho", "marigot", "grand-case"), "5 min",
            "Reliable taxi service across St. Maarten. Airport transfers, island tours, and late-night rides.",
            "+1-721-555-0103", true, "5 min"),
        ServiceProvider("4", "Island Cruisers", "taxi", 4.7, 156, "$$$",
            listOf("simpson-bay", "maho", "cupecoy", "orient-bay"), "10 min",
            "Luxury vehicle service with professional drivers. Perfect for airport pickups and special occasions.",
            "+1-721-555-0104", true, "12 min"),
        // Babysitting
        ServiceProvider("5", "Caring Hands", "babysitting", 5.0, 67, "$$",
            listOf("simpson-bay", "cupecoy", "cole-bay", "marigot"), "20 min",
            "Experienced and certified childcare providers. CPR certified, background checked.",
            "+1-721-555-0105", true, "30 min"),
        ServiceProvider("6", "Island Nannies", "babysitting", 4.8, 92, "$$$",
            listOf("maho", "orient-bay", "grand-case", "cul-de-sac"), "1 hour",
            "Professional nanny services for tourists and residents. Multilingual staff available.",
            "+1-721-555-0106", false, "2 hours"),
        // Food Delivery
        ServiceProvider("7", "SXM Eats Express", "food-delivery", 4.5, 523, "$",
            listOf("philipsburg", "simpson-bay", "maho", "marigot"), "45 min",
            "Fast food delivery from your favorite local restaurants. Real-time tracking.",
            "+1-721-555-0107", true, "35 min"),
        ServiceProvider("8", "Gourmet Go", "food-delivery", 4.7, 198, "$$",
            listOf("cupecoy", "cole-bay", "grand-case", "orient-bay"), "1 hour",
            "Premium delivery from fine dining restaurants. Temperature-controlled transport.",
            "+1-721-555-0108", true, "55 min"),
        // Home Repair
        ServiceProvider("9", "Fix-It Felix", "home-repair", 4.6, 145, "$$",
            listOf("simpson-bay", "cole-bay", "south-reward", "cay-hill"), "1 hour",
            "All-around handyman services. Plumbing, electrical, carpentry, and general repairs.",
            "+1-721-555-0109", true, "1 hour"),
        ServiceProvider("10", "SXM Plumbers", "home-repair", 4.9, 203, "$$$",
            listOf("philipsburg", "marigot", "french-quarter", "cay-hill"), "30 min",
            "Licensed plumbing professionals. Emergency services available 24/7.",
            "+1-721-555-0110", true, "25 min"),
        // Cleaning
        ServiceProvider("11", "Sparkle Squad", "cleaning", 4.8, 178, "$$",
            listOf("maho", "cupecoy", "orient-bay", "cul-de-sac"), "2 hours",
            "Professional cleaning for homes and vacation rentals. Deep cleaning available.",
            "+1-721-555-0111", true, "3 hours"),
        ServiceProvider("12", "Fresh Start", "cleaning", 4.5, 134, "$",
            listOf("simpson-bay", "cole-bay", "grand-case"), "1 hour",
            "Affordable cleaning services. Regular maintenance or one-time deep cleans.",
            "+1-721-555-0112", true, "1.5 hours"),
        // Pet Care
        ServiceProvider("13", "Paws & Relax", "pet-care", 5.0, 87, "$$",
            listOf("simpson-bay", "maho", "marigot", "french-quarter"), "30 min",
            "Dog walking, pet sitting, and basic grooming. Insured and pet-first-aid certified.",
            "+1-721-555-0113", true, "40 min"),
        // Moving
        ServiceProvider("14", "Island Movers", "moving", 4.7, 112, "$$$",
            listOf("philipsburg", "simpson-bay", "cole-bay", "marigot"), "2 hours",
            "Professional moving services. Trucks, packing supplies, and careful handling.",
            "+1-721-555-0114", false, "4 hours"),
        // Construction
        ServiceProvider("15", "Build Right SXM", "construction", 4.8, 76, "$$$$",
            listOf("cupecoy", "cole-bay", "orient-bay", "cul-de-sac"), "1 day",
            "Licensed construction and renovation. Painting, tiling, and major renovations.",
            "+1-721-555-0115", true, "Tomorrow"),
        // Property Care
        ServiceProvider("16", "Villa Care Pro", "property", 4.9, 94, "$$$",
            listOf("maho", "simpson-bay", "orient-bay", "grand-case"), "1 hour",
            "Complete property management. Pool maintenance, housekeeping, and guest services.",
            "+1-721-555-0116", true, "45 min"),
        // Car Rental
        ServiceProvider("17", "Island Wheels", "car-rental", 4.7, 186, "$",
            listOf("simpson-bay", "maho", "philipsburg", "marigot"), "30 min",
            "Wide selection of vehicles from compact cars to SUVs. Airport pickup and drop-off available.",
            "+1-721-555-0117", true, "30 min"),
        ServiceProvider("18", "SXM Auto Rentals", "car-rental", 4.5, 134, "$",
            listOf("cole-bay", "cay-hill", "south-reward", "french-quarter"), "1 hour",
            "Affordable daily and weekly rentals. Free delivery to your hotel or villa.",
            "+1-721-555-0118", true, "1 hour"),
        // Mechanic
        ServiceProvider("19", "SXM Auto Care", "mechanic", 4.9, 211, "$",
            listOf("cole-bay", "simpson-bay", "philipsburg", "cay-hill"), "1 hour",
            "Full-service auto repair shop. Engine diagnostics, brake service, AC repair, and more.",
            "+1-721-555-0119", true, "1 hour"),
        ServiceProvider("20", "Quick Fix Garage", "mechanic", 4.6, 98, "$$",
            listOf("marigot", "grand-case", "french-quarter", "cul-de-sac"), "2 hours",
            "Mobile mechanic service. We come to you for oil changes, tire repairs, and roadside assistance.",
            "+1-721-555-0120", true, "2 hours"),
        // Tutoring
        ServiceProvider("21", "SXM Scholars", "tutoring", 4.9, 145, "$",
            listOf("philipsburg", "simpson-bay", "cole-bay", "cay-hill"), "1 hour",
            "Certified tutors for all ages. Math, English, Science, SAT/ACT prep, and homework help.",
            "+1-721-555-0121", true, "1 hour"),
        ServiceProvider("22", "Island Tutors", "tutoring", 4.7, 89, "$$",
            listOf("marigot", "grand-case", "orient-bay", "french-quarter"), "2 hours",
            "Bilingual tutoring in French and English. Primary school through university level subjects.",
            "+1-721-555-0122", true, "2 hours"),
        // Hair Care
        ServiceProvider("23", "Island Glam Studio", "haircare", 4.8, 234, "$",
            listOf("simpson-bay", "maho", "cupecoy", "cole-bay"), "30 min",
            "Full-service hair salon. Cuts, color, braids, extensions, and special occasion styling.",
            "+1-721-555-0123", true, "45 min"),
        ServiceProvider("24", "Fresh Cuts SXM", "haircare", 4.6, 178, "$",
            listOf("philipsburg", "cay-hill", "south-reward", "marigot"), "15 min",
            "Modern barbershop and hair care. Fades, lineups, beard trims, and hair treatments.",
            "+1-721-555-0124", true, "20 min"),
        // Pool Service
        ServiceProvider("25", "Crystal Clear Pools", "pool-service", 4.9, 112, "$",
            listOf("maho", "cupecoy", "simpson-bay", "orient-bay"), "1 hour",
            "Professional pool cleaning and maintenance. Chemical balancing, filter cleaning, and equipment repair.",
            "+1-721-555-0125", true, "1 hour"),
        ServiceProvider("26", "AquaPro SXM", "pool-service", 4.7, 76, "$$",
            listOf("cole-bay", "cay-hill", "grand-case", "cul-de-sac"), "2 hours",
            "Complete pool services for villas and resorts. Weekly maintenance plans and emergency repairs available.",
            "+1-721-555-0126", true, "2 hours"),
    )

    val defaultBookings = listOf(
        Booking(
            id = "1", service = "Taxi Service", provider = "SXM Rides",
            date = "Today", time = "2:30 PM", status = BookingStatus.UPCOMING,
            from = "Princess Juliana Airport", to = "Simpson Bay Resort", price = "$35",
        ),
        Booking(
            id = "2", service = "Home Cleaning", provider = "Sparkle Squad",
            date = "Tomorrow", time = "10:00 AM", status = BookingStatus.CONFIRMED,
            address = "Cupecoy Villa 12", price = "$120",
        ),
        Booking(
            id = "3", service = "Landscaping", provider = "Island Gardens",
            date = "Apr 5, 2026", time = "9:00 AM", status = BookingStatus.COMPLETED,
            address = "Maho Beach Villa", price = "$85",
        ),
    )
}
