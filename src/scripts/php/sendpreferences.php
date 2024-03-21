<?php
  include("config.php");
  $postData = json_decode(file_get_contents("php://input"), TRUE);
  $adminId = $postData['adminId'];
  $preferences = $postData['preferences'];

  $updateSql = "UPDATE `userPreferences` SET CSSValues='$preferences' WHERE id='$adminId'";
  $sendResult = mysqli_query($link, $updateSql);
  if ($sendResult) {
    echo 'user ' . $adminId . ' changed preferences';
  } else {
    echo 'update failed.';
  }
  mysqli_close($link);
?>
