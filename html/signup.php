<?php 
	require('sessionvars.php');
	if(isset($userEmail)) {
		header("Location: /");
	}
	if(isset($_GET['r'])) {
		$redirect = urlencode($_GET['r']);
	}
?>
<?php
    require('db.php');
	function getUserIpAddr(){
		if(!empty($_SERVER['HTTP_CLIENT_IP'])){
			$ip = $_SERVER['HTTP_CLIENT_IP'];
		}elseif(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])){
			$ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
		}else{
			$ip = $_SERVER['REMOTE_ADDR'];
		}
		return $ip;
	}
    // When form submitted, insert values into the database.
    if ((!empty($_REQUEST['email'])) && (!empty($_REQUEST['password1'])) && (!empty($_REQUEST['password2'])) && (!empty($_REQUEST['username']))) {
		if ($_REQUEST['password1'] == $_REQUEST['password2']) {
			if (strlen($_REQUEST['username']) >= 6) {
			// if (filter_var($_REQUEST['email'], FILTER_VALIDATE_EMAIL)) {
        	// removes backslashes
			$idRandom = substr(str_shuffle('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'),1,30);
        	$username = stripslashes($_REQUEST['username']);
        	//escapes special characters in a string
        	$username = mysqli_real_escape_string($con, $username);
        	$email    = stripslashes($_REQUEST['email']);
        	$email    = mysqli_real_escape_string($con, $email);
        	$password = stripslashes($_REQUEST['password1']);
        	$password = mysqli_real_escape_string($con, $password);
        	$create_datetime = date("Y-m-d H:i:s");
			$ip = getUserIpAddr();
			$checkUserNameQuery    = "SELECT * FROM `users` WHERE username='$username'";
			$checkEmailQuery    = "SELECT * FROM `users` WHERE email='$email'";
			$checkUserNameResult = mysqli_query($con, $checkUserNameQuery) or die(header("Location: login.php?error=4"));
			$checkEmailResult = mysqli_query($con, $checkEmailQuery) or die(header("Location: login.php?error=4"));
			$checkUserNameRows = mysqli_num_rows($checkUserNameResult);
			$checkEmailRows = mysqli_num_rows($checkEmailResult);
			if ($checkUserNameRows == 0) { 
				if ($checkEmailRows == 0) {
					$query    = "INSERT into `users` (username, password, email, create_datetime, id, userIp)
					VALUES ('$username', '" . md5($password) . "', '$email', '$create_datetime', '$idRandom', '$ip')";
	   				$result   = mysqli_query($con, $query);
	   				if ($result) {
						setcookie("hasAccount", "Y");
						session_start();
						$_SESSION["email"] = $email;
						$_SESSION["password"] = md5($password);
						if (isset($redirect)) {
							header("Location: $redirect");
							exit;
						} else {
							header("Location: /");
							exit;
						}
	   				} else {
		   				header("Location: signup.php?error=2");
						exit;
	   				}
				} else {
					header("Location: signup.php?error=6");
					exit;
				}
			} else {
				header("Location: signup.php?error=5");
				exit;
			}
		} else {
			header("Location: signup.php?error=7");
			exit;
		}
		} else {
			header("Location: signup.php?error=1");
			exit;
		}
    } else {
?>
<!DOCTYPE html>
<html>
<head>

<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<link rel="dns-prefetch" href="/static/">

<title>Sign Up to Wrapper: Online</title>

<meta name="viewport" content="width=device-width, initial-scale=1">

<meta name="description" content="Make a video online for free with GoAnimate! Make videos for YouTube and Facebook, create business and educational videos, make animated e-cards and more!">
<meta property="og:site_name" content="Wrapper: Online">

<link href="/goapi/getStaticAsset/?file=droidopensans.css&subdir=fonts&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?file=bootstrap.css&subdir=bootstrap&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?file=bootstrap-modal.css&subdir=bootstrap&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?file=bootstrapSwitch.css&subdir=bootstrap&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?file=style.css&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?file=site.css&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?file=overlay.css&type=css" rel="stylesheet" type="text/css">
<link href="/goapi/getStaticAsset/?type=css&file=site_responsive.css" rel="stylesheet" type="text/css">

<link href="/signup.css" rel="stylesheet" type="text/css">
<!--[if lt IE 9]>
<style text="text/css">
.top-nav.collapse {height: auto;overflow: visible;}
</style>
<![endif]-->

<script src="/goapi/getStaticAsset/?type=js&subdir=jquery&file=jquery-1.11.0.min.js"></script>

<script src="/goapi/getStaticAsset/?type=js&subdir=bootstrap3&file=bootstrap.min.js"></script>
<script src="/goapi/getStaticAsset/?type=js&subdir=bootstrap3&file=bootstrap-modalmanager.js"></script>
<script src="/goapi/getStaticAsset/?type=js&subdir=bootstrap3&file=bootstrap-modal.js"></script>
<script src="/goapi/getStaticAsset/?type=js&subdir=bootstrap3&file=bootstrap-switch.min.js"></script>


<script src="/goapi/getStaticAsset/?type=js&file=go2.js"></script>
<script src="/goapi/getStaticAsset/?file=jquery.swfobject.min.js&type=js&subdir=jquery"></script>
<script src="/goapi/getStaticAsset/?type=js&subdir=jquery&file=jquery.blockUI-2.66.0.js"></script>
<script src="/goapi/getStaticAsset/?type=js&subdir=jquery&file=jquery.scrollTo.min.js"></script>
<script src="/goapi/getStaticAsset/?type=js&file=app.js"></script>

<script src="/goapi/getStaticAsset/?type=js&file=cookie.js"></script>
<script src="/goapi/getStaticAsset/?type=js&file=Gettext.js"></script>
<script type="text/javascript" src="/goapi/getStaticAsset/?type=po&file=goserver_js-en_US.json"></script>
<script type="text/javascript">
var I18N_LANG = 'en_US';
var GT = new Gettext({'locale_data': json_locale_data});
</script>

</head>
<body class="en_US">
<script type="text/javascript">
if (self !== top) {
			jQuery('body').hide();
	}
</script>

<script type="text/javascript">
		jQuery.extend(CCStandaloneBannerAdUI, {"actionshopSWF":"\/static\/animation\/actionshop.swf","apiserver":"\/","clientThemePath":"\/static\/<client_theme>","userId":""});
</script>

<div class="page-container">

<!-- HEADER -->
<div class="site-header">
	<div class="container site-header-inside clearfix">
		<a class="site-logo" href="/" title="Wrapper: Online">
			<img alt="Wrapper: Online" src="/goapi/getStaticAsset/?file=logo.svg&subdir=wrapper&type=img&httptype=image%2Fsvg%2Bxml">
		</a>

		<button type="button" class="top-nav-toggle" data-toggle="collapse" data-target="#top-nav">
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
			<span class="icon-bar"></span>
		</button>
		
			<ul id="top-nav" class="top-nav collapse">
				<li><a href="/signup">Sign Up</a></li>
				<li><a href="/login">Login</a></li>
				<li class="dropdown">
					<a class="dropdown-toggle" href="/videos" data-toggle="dropdown">Explore <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href="/forums">Forums</a></li>
						<li><a href="/videos">Videos</a></li>
					</ul>
				</li>
				<li class="top-nav-vm-btn">
					<span><a class="btn btn-orange" href="/videomaker">Make a Video</a></span>
				</li>
			</ul>

	</div>
</div>

<!-- END OF HEADER -->

<div class="hero">
	<div class="container">
		<div class="floating-form">
			<h1>Sign Up</h1>
			<?php 
                if (!isset($_GET['error'])) {} else {
					$hrstyle = 'border-bottom: 1px #222; width: 80%;';
                    if ($_GET['error'] == 1) {
                        $errordesc = "Passwords don't match.";
						$errortitle = "Signup Error!";
                    }
                    if ($_GET['error'] == 2) {
                        $errordesc = "Required fields missing.";
						$errortitle = "Signup Error!";
                    }
                    if ($_GET['error'] == 3) {
                        $errordesc = "You are banned from making accounts.";
						$errortitle = "Signup Error!";
                    }
                    if ($_GET['error'] == 4) {
                        $errordesc = "Internal MySQL error.";
						$errortitle = "Signup Error!";
                    }
					if ($_GET['error'] == 5) {
                        $errordesc = "Username taken.";
						$errortitle = "Signup Error!";
                    }
					if ($_GET['error'] == 6) {
                        $errordesc = "Email already used.";
						$errortitle = "Signup Error!";
					}
					if ($_GET['error'] == 7) {
                        $errordesc = "Username too short.";
						$errortitle = "Signup Error!";
					}
					if ($_GET['error'] == 69) {
                        $errordesc = "nice";
						$errortitle = "You Found a Secret!";
                    }
					if ($_GET['error'] == 420) {
                        $errordesc = "blaze it";
						$errortitle = "You Found a Secret!";
                    }
					if ($_GET['error'] == 1337) {
                        $errordesc = "elite";
						$errortitle = "You Found a Secret!";
                    }
                    if 
					(
						$_GET['error'] != 1 && 
						$_GET['error'] != 2 && 
						$_GET['error'] != 3 && 
						$_GET['error'] != 4 && 
						$_GET['error'] != 5 && 
						$_GET['error'] != 6 &&
						$_GET['error'] != 7 &&
						$_GET['error'] != 69 &&
						$_GET['error'] != 420 &&
						$_GET['error'] != 1337
					)
					{
						header('Location: /signup');
						exit;
                    }
                    print "
                    <div style=\"text-align: center; background-color: #ee8888; padding: 10px; margin-bottom: 30px; border: 5px solid #ee6666; border-radius: 5px; color: #3e3e3e;\" class=\"signuperror\">
						<div class=\"errorclose\"><a onclick=\"errorclose()\">x</a></div>
						<h4>$errortitle</h4>
						<center><hr style=\"$hrstyle\"></center>
                        <h5>$errordesc</h5>
                    </div>
                    ";
                } 
            ?>
			<form class="signup-form" id="signup-form" method="post" novalidate>
				<div class="form-error-message" id="signup-form-message"></div>
				<div class="form-row">
					<div class="form-input">
						<label class="fi email" for="signup-email">Email Address</label>
						<input id="signup-email" type="email" name="email" placeholder="EMAIL ADDRESS">
					</div>
				</div>
				<div class="form-row">
					<div class="form-input">
						<label class="fi username" for="signup-username">Display Name</label>
						<input id="signup-username" type="text" name="username" placeholder="DISPLAY NAME" maxlength="50">
					</div>
				</div>
				<div class="form-row">
					<div class="form-input">
						<label class="fi password" for="signup-password">Password</label>
						<input id="signup-password" type="password" name="password1" placeholder="PASSWORD" autocomplete="off">
					</div>
				</div>
				<div class="form-row">
					<div class="form-input">
						<label class="fi confirm-password" for="signup-confirm-password">Confirm Password</label>
						<input id="signup-confirm-password" type="password" name="password2" placeholder="CONFIRM PASSWORD" autocomplete="off">
					</div>
				</div>

				<div class="form-row" id="signup_captcha_container"></div>

				<div class="form-row" style="color: #bbb;">
					By signing up you agree to our <a href="/termsofuse" target="_blank">Terms of Use</a> and our <a href="https://web.archive.org/web/20140715044643/http://goanimate.com/privacy" target="_blank">Privacy Policy</a>.
					<input type="hidden" name="termsofuse" value="on">
				</div>

				<div class="form-row">
					<button class="btn btn-orange btn-large" id="btn-signup" type="submit">SIGN UP</button>
				</div>

				<div class="form-row" style="color: #bbb;">
					Registered? <a href="/login">Login here</a>.
				</div>
			</form>
		</div>
	</div>
</div>
    
<div id="container"></div>

<div id="offer_container">
</div>
<style>
	.form-row>a {
		color: #ddd;
	}
	.form-row>a:hover {
		color: #bbb;
		text-shadow: 1px 1px 2px #000;
	}
	.errorclose {
		position: absolute;
		right: 55px;
		top: 95px;
		font-size: 20px;
	}
	.errorclose>a {
		color: #ddd;
	}
	.errorclose>a:hover {
		color: #bbb;
	}
</style>
<script>
	function errorclose() {
		$( "div" ).remove( ".signuperror" );
	}
</script>
</body>
</html>
<?php
    }
?>
</body>
</html>