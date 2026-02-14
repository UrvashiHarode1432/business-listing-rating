<?php
include ('./config/database.php');

$action = $_POST['action'];

if ($action == 'create') {
    $stmt = $conn->prepare('INSERT INTO businesses (name,address,phone,email,average_rating,total_ratings)
                            VALUES (?,?,?,?,0,0)');
    $stmt->execute([
        $_POST['name'],
        $_POST['address'],
        $_POST['phone'],
        $_POST['email']
    ]);

    echo json_encode([
        'status' => 'success',
        'id' => $conn->lastInsertId()
    ]);
}

if ($action == 'update') {
    $stmt = $conn->prepare('UPDATE businesses 
                            SET name=?, address=?, phone=?, email=? 
                            WHERE id=?');
    $stmt->execute([
        $_POST['name'],
        $_POST['address'],
        $_POST['phone'],
        $_POST['email'],
        $_POST['id']
    ]);

    echo json_encode(['status' => 'updated']);
}

if ($action == 'delete') {
    $stmt = $conn->prepare('DELETE FROM businesses WHERE id=?');
    $stmt->execute([$_POST['id']]);

    echo json_encode(['status' => 'deleted']);
}
