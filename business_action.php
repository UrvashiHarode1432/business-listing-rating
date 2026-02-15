<?php
header('Content-Type: application/json');
include ('./config/database.php');

function validateBusinessInput($name, $address, $phone, $email)
{
    $errors = [];
    $name = trim($name ?? '');
    $address = trim($address ?? '');
    $phone = trim($phone ?? '');
    $email = trim($email ?? '');

    if (empty($name) || strlen($name) < 2) {
        $errors[] = 'Name is required and must be at least 2 characters.';
    }
    if (empty($address) || strlen($address) < 5) {
        $errors[] = 'Address is required and must be at least 5 characters.';
    }
    if (empty($phone)) {
        $errors[] = 'Phone is required.';
    } elseif (!preg_match('/^[\d\s\-+()]{7,20}$/', $phone)) {
        $errors[] = 'Please enter a valid phone number.';
    }
    if (empty($email)) {
        $errors[] = 'Email is required.';
    } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = 'Please enter a valid email address.';
    }

    return $errors;
}

$action = $_POST['action'] ?? '';

if (!in_array($action, ['create', 'update', 'delete'])) {
    echo json_encode([
        'status' => 'error',
        'message' => 'Request error'
    ]);
    exit;
}

if ($action == 'create') {
    $errors = validateBusinessInput(
        $_POST['name'] ?? '',
        $_POST['address'] ?? '',
        $_POST['phone'] ?? '',
        $_POST['email'] ?? ''
    );
    if (!empty($errors)) {
        echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
        exit;
    }
    $add_business = $conn->prepare('INSERT INTO businesses (name,address,phone,email,average_rating,total_ratings)
                            VALUES (?,?,?,?,0,0)');
    $add_business->execute([
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
    $errors = validateBusinessInput(
        $_POST['name'] ?? '',
        $_POST['address'] ?? '',
        $_POST['phone'] ?? '',
        $_POST['email'] ?? ''
    );
    if (!empty($errors)) {
        echo json_encode(['status' => 'error', 'message' => implode(' ', $errors)]);
        exit;
    }
    $update_business = $conn->prepare('UPDATE businesses 
                            SET name=?, address=?, phone=?, email=? 
                            WHERE id=?');
    $update_business->execute([
        $_POST['name'],
        $_POST['address'],
        $_POST['phone'],
        $_POST['email'],
        $_POST['id']
    ]);

    echo json_encode(['status' => 'updated']);
}

if ($action == 'delete') {
    $delete_business = $conn->prepare('DELETE FROM businesses WHERE id=?');
    $delete_business->execute([$_POST['id']]);

    echo json_encode(['status' => 'deleted']);
}
