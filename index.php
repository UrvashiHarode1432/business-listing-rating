<?php

include ('./config/database.php');

// listing business
$business = $conn->prepare('Select * from businesses');
$business->execute();
$result = $business->fetchAll(PDO::FETCH_ASSOC);

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Business Listing</title>

    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="css/style.css">
</head>
<body>
    <div class="container mt-4">
        <h2>Business Listing</h2>
        <button class="btn btn-success" id="addBusinessBtn">
            Add Business
        </button>
        <div id="global-alert"
            class="alert alert-success d-none"
            role="alert">
            <button type="button" class="close" data-dismiss="alert">
                <span>&times;</span>
            </button>
        </div>

        <table class="table table-striped" id="business-table" style="margin-top:50px">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Address</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th>Action</th>
                    <th>Average Rating</th>
                    <th>Total Rating</th>
                    <th>Rate</th>
                </tr>
            </thead>
            <tbody>
                <?php if (empty($result)): ?>
                <tr><td colspan="9" class="text-center text-muted py-4">No businesses yet. Add one to get started.</td></tr>
                <?php else:
    foreach ($result as $row): ?>
                            <tr id="row-<?= $row['id'] ?>">
                                <td><?= $row['id'] ?></td>
                                <td><?= htmlspecialchars($row['name']) ?></td>
                                <td><?= htmlspecialchars($row['address']) ?></td>
                                <td><?= htmlspecialchars($row['phone']) ?></td>
                                <td><?= htmlspecialchars($row['email']) ?></td>
                                <td class="action-buttons">
                                    <button class="btn btn-warning edit-btn"
                                        data-id="<?= $row['id'] ?>"
                                        data-name="<?= htmlspecialchars($row['name']) ?>"
                                        data-address="<?= htmlspecialchars($row['address']) ?>"
                                        data-phone="<?= htmlspecialchars($row['phone']) ?>"
                                        data-email="<?= htmlspecialchars($row['email']) ?>">
                                        Edit
                                    </button>
                                    <button class="btn btn-danger delete-btn"
                                        data-id="<?= $row['id'] ?>">
                                        Delete
                                    </button>
                                </td>
                                <td>
                                    <div class="rating-wrapper">
                                        <span id="avg-rating-text-<?= $row['id'] ?>" 
                                            class="rating-number">
                                            <?= $row['average_rating'] !== null
                                                ? '(' . number_format($row['average_rating'], 1) . ')'
                                                : '(0.0)' ?>
                                        </span>
                                        <div id="avg-rating-<?= $row['id'] ?>" 
                                            class="avg-rating" 
                                            data-score="<?= $row['average_rating'] ?>">
                                        </div>
                                    </div>
                                </td>
                                <td id="total-rating-<?= $row['id'] ?>">
                                    <?= $row['total_ratings'] ?>
                                </td>
                                <td>
                                <button type="button" class="btn btn-primary rate-btn" data-toggle="modal"
                                    data-target="#rating-modal" data-id="<?= $row['id'] ?>" data-name="<?= htmlspecialchars($row['name']) ?>">
                                    Rate Us
                                </button>
                                </td>
                            </tr>
                    <?php endforeach;
endif; ?>
            </tbody>
        </table>
        <!-- Rating Modal content-->
        <div id="rating-modal" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Give Business Rating</h4>
                    </div>
                    <div class="modal-body">
                    <div id="modal-alert" class="alert alert-dismissible fade show" role="alert">
                    </div>                     
                    <form id="rating-form">
                        <input type="hidden" name="business_id" id="modal-business-id">
                        <div class="form-group">
                            <label><strong>Business Name:</strong></label>
                            <p id="modal-business-name" style="font-size:16px; color:#333;"></p>
                        </div>
                        <div class="form-group">
                            <label>Name</label>
                            <input type="text" name="name" class="form-control"  required>
                        </div>
                        <div class="form-group">
                            <label>Email</label>
                            <input type="email" name="email" class="form-control"  required>
                        </div>
                        <div class="form-group">
                            <label>Phone</label>
                            <input type="text" name="phone" class="form-control"  required>
                        </div>
                        <div class="form-group">
                            <label>Rating</label>
                            <div id="modal-rating"></div>
                        </div>
                        <button type="submit" class="btn btn-primary" id="submit-rating">Submit Rating</button>
                    </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>
         <!-- Business Modal -->
        <div id="businessModal" class="modal fade" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title" id="modalTitle">Add Business</h4>
                    </div>
                    <div class="modal-body">
                        <div id="business-modal-alert" class="alert alert-dismissible d-none" role="alert"></div>
                        <form id="business-form">
                            <input type="hidden" name="id" id="business-id">
                            <div class="form-group">
                                <label>Name</label>
                                <input type="text" name="name" id="business-name" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Address</label>
                                <input type="text" name="address" id="business-address" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Phone</label>
                                <input type="text" name="phone" id="business-phone" class="form-control" required>
                            </div>
                            <div class="form-group">
                                <label>Email</label>
                                <input type="email" name="email" id="business-email" class="form-control" required>
                            </div>
                            <button type="submit" class="btn btn-primary">Save</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    
    
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.1/dist/umd/popper.min.js"></script>
<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/raty/3.1.1/jquery.raty.min.js"></script>
<script src="js/script.js"></script>
</body>
</html>