<?php include("config.php");
$postData = json_decode(file_get_contents("php://input"), TRUE);
$userID = $postData['userID'];

$statusSql = "SELECT `CSSValues` FROM `userPreferences` WHERE id=$userID";
$prefsResult = mysqli_query($link, $statusSql);
if ($prefsResult) {
  echo json_encode(mysqli_fetch_assoc($prefsResult));
}
mysqli_close($link);
?>