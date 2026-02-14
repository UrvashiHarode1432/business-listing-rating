Business Listing & Rating System

A simple Business Listing web application built with PHP, MySQL, jQuery, Bootstrap 4, and jQuery Raty for star ratings.

<!-- Users can: -->

Add businesses

Edit/Delete businesses

Submit ratings

Update rating if email/phone already exists

View average rating dynamically

<!-- Features: -->

CRUD operations for businesses

Star rating system using jQuery Raty

Update existing rating (based on email or phone)

Real-time average rating update via AJAX

Bootstrap 4 responsive UI

Unique constraint to prevent duplicate ratings

<!-- Tech Stack: -->

PHP (Core PHP)

MySQL

jQuery

Bootstrap 4

jQuery Raty Plugin

AJAX

<!-- Project Structure -->

Business_listing_rating/
│
├── config/
│ └── database.php
│
├── css/
│ └── style.css
│
├── js/
│ └── script.js
│
├── images/
│ ├── star-on.png
│ ├── star-off.png
│ └── star-half.png
│
├── index.php
├── submit_rating.php
├── business_action.php
└── README.md

<!-- Create Database -->

business_listing_rating

<!-- Import Tables -->

CREATE TABLE businesses (
id INT AUTO_INCREMENT PRIMARY KEY,
name VARCHAR(150) NOT NULL,
address VARCHAR(255) NOT NULL,
phone VARCHAR(20) NOT NULL,
email VARCHAR(150) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE ratings (
id INT AUTO_INCREMENT PRIMARY KEY,
business_id INT NOT NULL,
name VARCHAR(150),
email VARCHAR(150) NOT NULL,
phone VARCHAR(20) NOT NULL,
rating DECIMAL(2,1) NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (business_id) REFERENCES businesses(id) ON DELETE CASCADE,
UNIQUE KEY unique_email (business_id, email),
UNIQUE KEY unique_phone (business_id, phone)
);

<!-- How Rating Logic Works -->

If user email OR phone already exists for same business → Rating is updated

If new user → New rating is inserted

Average rating and total ratings are calculated dynamically
