<?php
try {
    $conn = new PDO(
        "mysql:host=localhost;dbname=business_listing_rating",
        "root",
        ""
    );

    // Enable error reporting
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage());
}
?>