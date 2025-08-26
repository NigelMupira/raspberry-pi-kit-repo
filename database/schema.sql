-- Create database
CREATE DATABASE IF NOT EXISTS kit_repository;
USE kit_repository;

-- Table for kits
CREATE TABLE kits (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    condition ENUM('Excellent', 'Good', 'Fair', 'Poor') DEFAULT 'Good',
    status ENUM('Available', 'Loaned', 'Under Maintenance') DEFAULT 'Available',
    image_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table for components
CREATE TABLE components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Junction table for kit components (many-to-many relationship)
CREATE TABLE kit_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kit_id INT NOT NULL,
    component_id INT NOT NULL,
    quantity INT DEFAULT 1,
    FOREIGN KEY (kit_id) REFERENCES kits(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
    UNIQUE KEY unique_kit_component (kit_id, component_id)
);

-- Table for students
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    program VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for loans
CREATE TABLE loans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    kit_id INT NOT NULL,
    student_id INT NOT NULL,
    borrowed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    returned_at TIMESTAMP NULL,
    due_at TIMESTAMP NOT NULL,
    condition_borrowed ENUM('Excellent', 'Good', 'Fair', 'Poor') DEFAULT 'Good',
    condition_returned ENUM('Excellent', 'Good', 'Fair', 'Poor') NULL,
    FOREIGN KEY (kit_id) REFERENCES kits(id),
    FOREIGN KEY (student_id) REFERENCES students(id)
);

-- Junction table for loan components (tracks which components were returned)
CREATE TABLE loan_components (
    id INT AUTO_INCREMENT PRIMARY KEY,
    loan_id INT NOT NULL,
    component_id INT NOT NULL,
    returned BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (loan_id) REFERENCES loans(id) ON DELETE CASCADE,
    FOREIGN KEY (component_id) REFERENCES components(id) ON DELETE CASCADE,
    UNIQUE KEY unique_loan_component (loan_id, component_id)
);