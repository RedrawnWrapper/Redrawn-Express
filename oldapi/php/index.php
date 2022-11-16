<?php session_start(); /* Starts the session */

if(!isset($_SESSION['UserData']['Username'])){
        header("location:login.php");
        exit;
}
?>

Congratulations! You have logged into Anistick. <a href="logout.php">Click here</a> to Logout. <a href="/html/list.html">Click here</a> to Make A Video!. 