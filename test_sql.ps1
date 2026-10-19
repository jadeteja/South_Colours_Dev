$connStr = "Server=.\SQLEXPRESS01;Database=SouthColoursDb;Integrated Security=True;TrustServerCertificate=True;Connect Timeout=5"
$conn = New-Object System.Data.SqlClient.SqlConnection($connStr)
try {
    $conn.Open()
    Write-Host "SUCCESS: Connected to SQLEXPRESS01"
    $cmd = $conn.CreateCommand()
    $cmd.CommandText = "SELECT COUNT(*) FROM Products"
    $count = $cmd.ExecuteScalar()
    Write-Host "Product count: $count"
    $conn.Close()
} catch {
    Write-Host "ERROR: $($_.Exception.Message)"
}
