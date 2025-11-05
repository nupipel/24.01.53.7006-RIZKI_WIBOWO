<?php
// Test Database Connection
echo "<h2>Database Connection Test</h2>";

$config = [
    'host' => 'localhost',
    'dbname' => 'db_universitas',
    'user' => 'root',
    'pass' => ''
];

try {
    $pdo = new PDO(
        "mysql:host={$config['host']};dbname={$config['dbname']}", 
        $config['user'], 
        $config['pass']
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    echo "<p style='color: green;'>✓ Database connection successful!</p>";
    
    // Test tables
    echo "<h3>Tables in database:</h3>";
    $stmt = $pdo->query("SHOW TABLES");
    $tables = $stmt->fetchAll(PDO::FETCH_COLUMN);
    
    echo "<ul>";
    foreach ($tables as $table) {
        $count = $pdo->query("SELECT COUNT(*) FROM `$table`")->fetchColumn();
        echo "<li>$table ($count records)</li>";
    }
    echo "</ul>";
    
    // PHP Version
    echo "<h3>Environment Info:</h3>";
    echo "<ul>";
    echo "<li>PHP Version: " . phpversion() . "</li>";
    echo "<li>PDO MySQL: " . (extension_loaded('pdo_mysql') ? 'Enabled' : 'Disabled') . "</li>";
    echo "<li>JSON: " . (extension_loaded('json') ? 'Enabled' : 'Disabled') . "</li>";
    echo "</ul>";
    
} catch(PDOException $e) {
    echo "<p style='color: red;'>✗ Database connection failed: " . $e->getMessage() . "</p>";
    echo "<h3>Troubleshooting:</h3>";
    echo "<ol>";
    echo "<li>Check if MySQL is running</li>";
    echo "<li>Verify database name: 'db_universitas'</li>";
    echo "<li>Check username and password</li>";
    echo "<li>Import the SQL file: backend/db_universitas.sql</li>";
    echo "</ol>";
}

// Test API endpoint
echo "<h2>API Endpoint Test</h2>";
echo "<p>API URL: <code>http://localhost/universitas-crud/backend/api.php/records/fakultas</code></p>";
echo "<p>Try accessing the API directly in your browser or use the button below:</p>";
echo '<button onclick="testAPI()">Test API</button>';
echo '<div id="api-result"></div>';
?>

<script>
function testAPI() {
    fetch('http://localhost/universitas-crud/backend/api.php/records/fakultas')
        .then(response => response.json())
        .then(data => {
            document.getElementById('api-result').innerHTML = 
                '<pre style="background: #f4f4f4; padding: 10px;">' + 
                JSON.stringify(data, null, 2) + '</pre>';
        })
        .catch(error => {
            document.getElementById('api-result').innerHTML = 
                '<p style="color: red;">Error: ' + error + '</p>';
        });
}
</script>
