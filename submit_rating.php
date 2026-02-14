<?php
include ('./config/database.php');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode([
        'status' => 'error',
        'message' => 'Invalid request'
    ]);
    exit;
}

$business_id = $_POST['business_id'] ?? null;
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$phone = trim($_POST['phone'] ?? '');
$rating = $_POST['rating'] ?? null;

if (empty($business_id) || empty($rating)) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Business ID and rating are required'
    ]);
    exit;
}

try {
    // 1️⃣ Check if user already rated this business (by email OR phone)
    $check = $conn->prepare('
        SELECT id FROM ratings
        WHERE business_id = :business_id
        AND (email = :email OR phone = :phone)
        LIMIT 1
    ');

    $check->execute([
        ':business_id' => $business_id,
        ':email' => $email,
        ':phone' => $phone
    ]);

    $existing = $check->fetch(PDO::FETCH_ASSOC);

    if ($existing) {
        // ✅ RULE 1 → Update existing rating
        $update = $conn->prepare('
            UPDATE ratings 
            SET name = :name,
                rating = :rating,
                updated_at = NOW()
            WHERE id = :id
        ');

        $update->execute([
            ':name' => $name,
            ':rating' => $rating,
            ':id' => $existing['id']
        ]);
    } else {
        // ✅ RULE 2 → Insert new rating
        $insert = $conn->prepare('
            INSERT INTO ratings (business_id, name, email, phone, rating)
            VALUES (:business_id, :name, :email, :phone, :rating)
            ON DUPLICATE KEY UPDATE
            name = VALUES(name),
            rating = VALUES(rating)
            ');

        $insert->execute([
            ':business_id' => $business_id,
            ':name' => $name,
            ':email' => $email,
            ':phone' => $phone,
            ':rating' => $rating
        ]);
    }

    // 2️⃣ Get updated stats
    $stats = $conn->prepare('
        SELECT 
            ROUND(AVG(rating),1) AS average_rating,
            COUNT(*) AS total_ratings
        FROM ratings
        WHERE business_id = :business_id
    ');

    $stats->execute([':business_id' => $business_id]);
    $result = $stats->fetch(PDO::FETCH_ASSOC);

    // Update businesses table with new stats
    $updateBusiness = $conn->prepare('
        UPDATE businesses 
        SET average_rating = :average_rating,
            total_ratings = :total_ratings
        WHERE id = :business_id
    ');

    $updateBusiness->execute([
        ':average_rating' => $result['average_rating'],
        ':total_ratings' => $result['total_ratings'],
        ':business_id' => $business_id
    ]);

    echo json_encode([
        'status' => 'success',
        'business_id' => $business_id,
        'average_rating' => (float) $result['average_rating'],
        'total_ratings' => (int) $result['total_ratings']
    ]);
} catch (PDOException $e) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Database error'
    ]);
}
