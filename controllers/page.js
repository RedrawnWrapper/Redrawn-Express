const express = require("express"),
      router = express.Router(),
      fUtil = require("../models/file"),
      stuff = require("../models/page"),
      http = require("http"),
      url = require("url"),
      movie = require("../models/movie"),
      list = movie.loadRows(),
	  path = require("path")

const { Account, users } = require("./account")

function toAttrString(table) {
	return typeof table == "object"
		? Object.keys(table)
				.filter((key) => table[key] !== null)
				.map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(table[key])}`)
				.join("&")
		: table.replace(/"/g, '\\"');
}
function toParamString(table) {
	return Object.keys(table)
		.map((key) => `<param name="${key}" value="${toAttrString(table[key])}">`)
		.join(" ");
}
function toObjectString(attrs, params) {
	return `<object id="obj" ${Object.keys(attrs)
		.map((key) => `${key}="${attrs[key].replace(/"/g, '\\"')}"`)
		.join(" ")}>${toParamString(params)}</object>`;
}

/**
 * @param {http.IncomingMessage} req
 * @param {http.ServerResponse} res
 * @param {import("url").UrlWithParsedQuery} url
 * @returns {boolean}
 */
var title, attrs, params;
router.get("/cc", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	title = "Character Creator";
	attrs = {
		data: process.env.SWF_URL + "/cc.swf", // data: 'cc.swf',
		type: "application/x-shockwave-flash",
		id: "char_creator",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			original_asset_id: query["id"] || null,
			themeId: "business",
			ut: 60,
			bs: "default",
			appCode: "go",
			page: "",
			siteId: "go",
			m_mode: "school",
			isLogin: "Y",
			isEmbed: 1,
			ctc: "go",
			tlang: "en_US",
		},
		allowScriptAccess: "always",
		movie: process.env.SWF_URL + "/cc.swf", // 'http://localhost/cc_browser.swf'
	};
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.send(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages["/cc"] || ""}`
	);
})
router.get("/cc_browser", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	title = "CC Browser";
	attrs = {
		data: process.env.SWF_URL + "/cc_browser.swf", // data: 'cc_browser.swf',
		type: "application/x-shockwave-flash",
		id: "char_creator",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
			original_asset_id: query["id"] || null,
			themeId: "family",
			ut: 60,
			appCode: "go",
			page: "",
			siteId: "go",
			m_mode: "school",
			isLogin: "Y",
			isEmbed: 1,
			ctc: "go",
			tlang: "en_US",
			lid: 13,
		},
		allowScriptAccess: "always",
		movie: process.env.SWF_URL + "/cc_browser.swf", // 'http://localhost/cc_browser.swf'
	};
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.send(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>`
	);
})
router.get("/go_full", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	const noruffle = query.noruffle ? `&noruffle=${query.noruffle}` : '';
	var prefix;
	if (req.headers.host == "localhost" && req.headers.host == `localhost:${process.env.port}`) prefix = "http";
	else prefix = "https";
	if (query.tray == "zimmertwins") res.send(`<html><head><script>function redirect() { 
	  location.href = 'https://zimmertwins.onrender.com/starters?homeUrl=${prefix}://${req.headers.host}/html/homepage.html${noruffle}'; 
	}</script></head><body onload="redirect()"></body></html>`);
	else {
		var swf;
		title = "Video Editor";
		if (p.query.mode != "dark") swf = !p.query.v ? 
			process.env.SWF_URL + `/go_full.swf` : `//josephanimate2021.github.io/animation/${p.query.v}/go_full.swf`;
		else swf = "https://josephanimate2021.github.io/Animium-Swfs/go_dark.swf";
		attrs = {
			data: swf,
			type: "application/x-shockwave-flash",
			width: "100%",
			height: "100%",
		};
		params = {
			flashvars: {
				apiserver: "/",
				storePath: !p.query.v ? process.env.STORE_URL + "/<store>" : "https://josephanimate2021.github.io/store/50/<store>",
				isEmbed: 1,
				ctc: "go",
				ut: 50,
				bs: "default",
				appCode: "go",
				page: "",
				siteId: "go",
				lid: 13,
				isLogin: "Y",
				retut: 1,
				clientThemePath: !p.query.v ? 
				process.env.CLIENT_URL + "/<client_theme>" : "https://josephanimate2021.github.io/static/477/<client_theme>",
				tray: "retro",
				tlang: "en_US",
				movieId: query.movieId || "",
				goteam_draft_only: 1,
				isWide: 1,
				collab: 0,
				nextUrl: "/html/list.html",
			},
			allowScriptAccess: "always",
		};
		res.setHeader("Content-Type", "text/html; charset=UTF-8");
		Object.assign(params.flashvars, query);
		res.send(
			`<script>document.title='${title}',flashvars=${JSON.stringify(
				params.flashvars
			)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>${stuff.pages["/go_full"] || ""}`
		);
	}
})
router.get("/player", (req, res) => {
	const p = url.parse(req.url, true);
	const query = p.query;
	title = "Player";
	attrs = {
		data: process.env.SWF_URL + "/player.swf",
		type: "application/x-shockwave-flash",
		width: "100%",
		height: "100%",
	};
	params = {
		flashvars: {
			apiserver: "/",
			storePath: process.env.STORE_URL + "/<store>",
			ut: 60,
			autostart: 1,
			isWide: 1,
			clientThemePath: process.env.CLIENT_URL + "/<client_theme>",
		},
		allowScriptAccess: "always",
		allowFullScreen: "true",
	};
	res.setHeader("Content-Type", "text/html; charset=UTF-8");
	Object.assign(params.flashvars, query);
	res.send(
		`<script>document.title='${title}',flashvars=${JSON.stringify(
			params.flashvars
		)}</script><body style="margin:0px">${toObjectString(attrs, params)}</body>`
	);
})
router.get("/test/aniPlayer", (req, res) => {
	const p = url.parse(req.url, true);
	attrs = {
		data: p.query.swfUrl,
		type: "application/x-shockwave-flash",
		width: "100%",
		height: "100%"
	};
	params = {
		flashvars: {
			vURL: p.query.fileUrl
		},
		allowScriptAccess: "always"
	};
	res.setHeader("Content-Type", "text/html; charset=utf8");
	res.send(`<body style="margin:0px">${toObjectString(attrs, params)}</body>`);
})
router.get("/videomaker", (req, res) => {
	const p = url.parse(req.url, true);
	res.setHeader("Content-Type", "text/html; charset=utf8");
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<link rel="dns-prefetch" href="//web.archive.org/web/20141204150606/http://lightspeed.goanimate.com/">
	
	<title>Create - Redrawn</title>
	
	
	<meta name="description" content="Make a premium video using GoAnimate's powerful Video Maker studio. Enjoy full creative control with simple drag &amp; drop tools. Make a video today!">
	<meta property="og:site_name" content="GoAnimate">
	<meta property="fb:app_id" content="177116303202">
	
	<meta name="google-site-verification" content="K_niiTfCVi72gwvxK00O4NjsVybMutMUnc-ZnN6HUuA">
	
	<link rel="alternate" href="http://feeds.feedburner.com/GoAnimate" type="application/rss+xml" title="GoAnimate Blog">
	<link rel="alternate" href="http://feeds.feedburner.com/GoAnimate/WhatsNew" type="application/rss+xml" title="GoAnimate - Recently Released Content">
	<link rel="alternate" href="http://feeds.feedburner.com/GoAnimate/MostWatched" type="application/rss+xml" title="GoAnimate - Most Watched">
	
	<link href="//fonts.googleapis.com/css?family=Droid+Sans:400,700|Open+Sans:400,600,700" rel="stylesheet" type="text/css">
	<link href="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/css/common_combined.css" rel="stylesheet" type="text/css">
	
	<link href="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/css/upsell_modals.css" rel="stylesheet" type="text/css">
	<link href="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/css/videomaker.css" rel="stylesheet" type="text/css">
	<!--[if lt IE 9]>
	<style text="text/css">
	.top-nav.collapse {height: auto;overflow: visible;}
	</style>
	<![endif]-->
	
	<script>
	var srv_tz_os = -5, view_name = "go", user_cookie_name = "u_info";
	</script>
	
	<script src="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/js/common_combined.js"></script>
	<script type="text/javascript" src="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/po/goserver_js-en_US.json"></script>
	<script type="text/javascript">
		var I18N_LANG = 'en_US';
		var GT = new Gettext({'locale_data': json_locale_data});
		function getYear() {
			let currentDate = new Date();
			let cYear = currentDate.getFullYear();
			document.getElementById("CopyrightYear").innerHTML = \`&nbsp;&nbsp;&nbsp; Redrawn © \${cYear}\`;
		}
	</script>
	
	<script src="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/js/jquery/jquery.flexslider.min.js"></script>
	<script src="https://redrawnwrapper.github.io/Redrawn-Express/static/a0cbfe8e1f619bcc/go/js/trial_upsell.js"></script>
	
	
	<script type="text/javascript" src="http://www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>
	
	<!-- Google Analytics -->
	<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-2516970-1']);
	_gaq.push(['_setDomainName', 'none']);
	_gaq.push(['_trackPageview']);
	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	
	ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
	
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	</script>
	
	<!-- GoAnimate_Footer_ROS_Bottom_960x284 -->
	<script type="text/javascript" src="http://partner.googleadservices.com/gampad/google_service.js">
	</script>
	<script type="text/javascript">
	GS_googleAddAdSenseService("ca-pub-9090384317741239");
	GS_googleEnableAllServices();
	</script>
	<script type="text/javascript">
	GA_googleAddAttr("is_login", "no");
	GA_googleAddAttr("is_plus", "no");
	GA_googleAddAttr("is_creator", "no");
	</script>
	<script type="text/javascript">
	GA_googleAddSlot("ca-pub-9090384317741239", "GoAnimate_Footer_ROS_Bottom_960x284");
	</script>
	<script type="text/javascript">
	GA_googleFetchAds();
	</script>
	<!-- GoAnimate_Footer_ROS_Bottom_960x284 -->
	
	
	<link href="https://plus.google.com/+goanimate" rel="publisher">
	
	</head>
	<body class="en_US" onload="getYear()">
	<script type="text/javascript">
	if (self !== top) {
				jQuery('body').hide();
		}
	</script>
	<div id="fb-root"></div>
	<script type="text/javascript">
	  window.fbAsyncInit = function() {
		FB.init({appId: '177116303202', cookie: true, status: true, xfbml: true});
		jQuery(document).ready(function() {
		  jQuery(document).trigger('facebook.init');
		});
	  };
	  (function() {
		var e = document.createElement('script'); e.async = true;
		e.src = document.location.protocol +
		  '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(e);
	  }());
	</script>
	
	<script type="text/javascript">
	  var _kmq = _kmq || [];
	  var _kmk = _kmk || 'd6e9ca5d19bda4afea55a1493af00d0b98c26240';
	  function _kms(u){
		setTimeout(function(){
		  var d = document, f = d.getElementsByTagName('script')[0],
		  s = d.createElement('script');
		  s.type = 'text/javascript'; s.async = true; s.src = u;
		  f.parentNode.insertBefore(s, f);
		}, 1);
	  }
	  _kms('//i.kissmetrics.com/i.js');
	  _kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
	</script>
	
	<script type="text/javascript">
			jQuery.extend(CCStandaloneBannerAdUI, {"actionshopSWF":"https:\/\/web.archive.org\/web\/20141204150606\/http:\/\/lightspeed.goanimate.com\/animation\/ad1b4b02721506d6\/actionshop.swf","apiserver":"https:\/\/web.archive.org\/web\/20141204150606\/http:\/\/goanimate.com\/","clientThemePath":"https:\/\/web.archive.org\/web\/20141204150606\/http:\/\/lightspeed.goanimate.com\/static\/a0cbfe8e1f619bcc\/<client_theme>","userId":""});
	</script>
	
	<div class="page-container">
	
	<!-- HEADER -->
	<div class="site-header">
		<div class="container site-header-inside clearfix">
			<a class="site-logo" href="/" title="Redrawn">
				<img alt="Make a Video With Redrawn" src="${fUtil.logo(req.headers.host)}">
			</a>
		
			<button type="button" class="top-nav-toggle" data-toggle="collapse" data-target="#top-nav">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
		
			<ul id="top-nav" class="top-nav collapse">
				<li><a id="upload_movie">Upload A Movie</a></li>
				<li><a href="https://www.anistick.com/recorder">Anistick Recorder</a></li>
				<li class="dropdown">
					<a class="dropdown-toggle" href="/html/list.html" data-toggle="dropdown">Explore <span class="caret"></span></a>
					<ul class="dropdown-menu">
						<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/changelog.md?token=GHSAT0AAAAAABT2BKZIAW7G2UINSYE3V4FAYTNYLRQ">Update Log</a></li>
						<li><a href="https://youtube.com/@josephanimate">Joseph's YouTube Channel</a></li>
						<li><a href="/html/list.html">Your Videos</a></li>
						<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/faq.md?token=GHSAT0AAAAAABT2BKZIXY6CE6Y3JEHLK6LEYTNYMSQ">FAQ</a></li>
					</ul>
				</li>
				<li>
					<a class="bright" id="upload_char">Upload a Char</a>
				</li>
				<li class="top-nav-vm-btn">
					<span><a class="btn btn-${fUtil.color(req.headers.host)}" href="/app/videomaker">Make a Video</a></span>
				</li>
			</ul>
		
		</div>
	</div>
	
	<!-- END OF HEADER -->
	
	<div class="vm-tutorial">
		<div class="container">
			<div class="tutorial-video" style="display:none;">
	
	<div id="wistia_9z4fah3lag" class="wistia_embed" style="width:860px;height:484px;"><div itemprop="video" itemscope itemtype="http://schema.org/VideoObject"><meta itemprop="name" content="How to Use GoAnimate"/><meta itemprop="duration" content="PT3M27S"/><meta itemprop="thumbnailUrl" content="http://embed.wistia.com/deliveries/e3f2aaca2e8b243a83bf5f6e049391fa7e10320c.bin"/><meta itemprop="contentURL" content="http://embed.wistia.com/deliveries/00a07fa93ba333cc10aa9d9726681453a918ac7e.bin"/><meta itemprop="embedURL" content="http://embed.wistia.com/flash/embed_player_v2.0.swf?2013-07-03&amp;autoPlay=false&amp;banner=false&amp;controlsVisibleOnLoad=true&amp;customColor=7b796a&amp;endVideoBehavior=default&amp;fullscreenDisabled=true&amp;mediaDuration=207.0&amp;playButtonVisible=true&amp;showPlayButton=true&amp;showPlaybar=true&amp;showVolume=true&amp;stillUrl=http%3A%2F%2Fembed.wistia.com%2Fdeliveries%2Ff2d43e338bed04ffd7650c3da9a54a48d87e40af.jpg%3Fimage_crop_resized%3D860x484&amp;unbufferedSeek=true&amp;videoUrl=http%3A%2F%2Fembed.wistia.com%2Fdeliveries%2F00a07fa93ba333cc10aa9d9726681453a918ac7e.bin"/><meta itemprop="uploadDate" content="2013-09-04T11:23:02Z"/><object id="wistia_9z4fah3lag_seo" classid="clsid:D27CDB6E-AE6D-11cf-96B8-444553540000" style="display:block;height:484px;position:relative;width:860px;"><param name="movie" value="http://embed.wistia.com/flash/embed_player_v2.0.swf?2013-07-03"></param><param name="allowfullscreen" value="true"></param><param name="allowscriptaccess" value="always"></param><param name="bgcolor" value="#000000"></param><param name="wmode" value="opaque"></param><param name="flashvars" value="autoPlay=false&amp;banner=false&amp;controlsVisibleOnLoad=true&amp;customColor=7b796a&amp;endVideoBehavior=default&amp;fullscreenDisabled=true&amp;mediaDuration=207.0&amp;playButtonVisible=true&amp;showPlayButton=true&amp;showPlaybar=true&amp;showVolume=true&amp;stillUrl=http%3A%2F%2Fembed.wistia.com%2Fdeliveries%2Ff2d43e338bed04ffd7650c3da9a54a48d87e40af.jpg%3Fimage_crop_resized%3D860x484&amp;unbufferedSeek=true&amp;videoUrl=http%3A%2F%2Fembed.wistia.com%2Fdeliveries%2F00a07fa93ba333cc10aa9d9726681453a918ac7e.bin"></param><embed src="https://web.archive.org/web/20141204150606oe_/http://embed.wistia.com/flash/embed_player_v2.0.swf?2013-07-03" allowfullscreen="true" allowscriptaccess="always" bgcolor="#000000" flashvars="autoPlay=false&amp;banner=false&amp;controlsVisibleOnLoad=true&amp;customColor=7b796a&amp;endVideoBehavior=default&amp;fullscreenDisabled=true&amp;mediaDuration=207.0&amp;playButtonVisible=true&amp;showPlayButton=true&amp;showPlaybar=true&amp;showVolume=true&amp;stillUrl=http%3A%2F%2Fembed.wistia.com%2Fdeliveries%2Ff2d43e338bed04ffd7650c3da9a54a48d87e40af.jpg%3Fimage_crop_resized%3D860x484&amp;unbufferedSeek=true&amp;videoUrl=http%3A%2F%2Fembed.wistia.com%2Fdeliveries%2F00a07fa93ba333cc10aa9d9726681453a918ac7e.bin" name="wistia_9z4fah3lag_html" style="display:block;height:100%;position:relative;width:100%;" type="application/x-shockwave-flash" wmode="opaque"></embed></object><noscript itemprop="description">How to Use GoAnimate</noscript></div></div>
	<script charset="ISO-8859-1" src="http://fast.wistia.com/static/concat/E-v1.js"></script>
	<script>
	wistiaEmbed = Wistia.embed("9z4fah3lag");
	</script>
	<script charset="ISO-8859-1" src="http://fast.wistia.com/embed/medias/9z4fah3lag/metadata.js"></script>
	
			</div>
			<div class="vm-tutorial-trigger-container">
				<a class="vm-tutorial-trigger" href="#" target="_blank">
					<span class="on">Watch Tutorial</span>
					<span class="off">Close</span>
				</a>
			</div>
		</div>
	</div>
	
	<div class="vm-bf-wrapper">
	<div class="vm-bf" id="topbanner-wb">
		<div class="container">
			<h1>Turn Ideas And Video Scripts Into Animations Easily!</h1>
			<div class="vm-bf-content">
				<h6>Redrawn was originaly created by anger towards the wrapper devs and it's community. this project started back in april 2022 and retired on june 28 2022 due to tts issues. good news is that after coming back, all issues have been resolved. To this day, redrawn is a spinoff to the latest Wrapper Offline 2.0.0 with broken vocalware voices and more stuff.</h6>
			</div>
		</div>
	</div>
	</div>
	
	<div class="container themes-section">
		<div class="header">
			<div class="header-content">
				<h2>Select A Theme</h2>
				Pick a video-making theme based on its visual style, or use the filter to choose based on features.        </div>
			<div class="filter-dropdown-container">
				<div class="filter-dropdown dropdown">
					<a class="filter-dropdown-toggle" data-toggle="dropdown" href="#">Filter <span class="caret"></span></a>
					<ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dLabel">
						<li>
							<a class="filter-item" href="#" data-filter="lipsync">
								<div class="filter-icon"><img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/filter_lip.png" alt=""></div>
								<div class="filter-body">
									<div class="filter-name"><strong>Lip-sync</strong></div>
									<span class="filter-desc">Characters automatically lip-sync their dialog when lines are assigned to them.</span>
								</div>
								<div class="filter-checkbox-container">
									<span class="filter-checkbox"></span>
								</div>
							</a>
						</li>
						<li>
							<a class="filter-item" href="#" data-filter="ext_lib">
								<div class="filter-icon"><img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/filter_library.png" alt=""></div>
								<div class="filter-body">
									<div class="filter-name"><strong>Extensive Library</strong></div>
									<span class="filter-desc">Collections of characters, backgrounds and props corresponding to a wide variety of locations, occupations and industries.</span>
								</div>
								<div class="filter-checkbox-container">
									<span class="filter-checkbox"></span>
								</div>
							</a>
						</li>
						<li>
							<a class="filter-item" href="#" data-filter="starters">
								<div class="filter-icon"><img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/filter_starter.png" alt=""></div>
								<div class="filter-body">
									<div class="filter-name"><strong>Scene Starters</strong></div>
									<span class="filter-desc">Pre-made sequences that help you get started (or finished) quickly!  You can also save your own frequently-used sequences as starters.</span>
								</div>
								<div class="filter-checkbox-container">
									<span class="filter-checkbox"></span>
								</div>
							</a>
						</li>
						<li>
							<a class="filter-item" href="#" data-filter="qvm">
								<div class="filter-icon"><img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/filter_template.png" alt=""></div>
								<div class="filter-body">
									<div class="filter-name"><strong>Template</strong></div>
									<span class="filter-desc">Super-fast tool for creating simple, dialog-based videos.  Be finished in minutes!</span>
								</div>
								<div class="filter-checkbox-container">
									<span class="filter-checkbox"></span>
								</div>
							</a>
						</li>
						<li>
							<a class="filter-item" href="#" data-filter="char_creator">
								<div class="filter-icon"><img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/filter_cc.png" alt=""></div>
								<div class="filter-body">
									<div class="filter-name"><strong>Character Creator</strong></div>
									<span class="filter-desc">Customize your characters!  Adapt existing characters to meet your needs or build completely from scratch.</span>
								</div>
								<div class="filter-checkbox-container">
									<span class="filter-checkbox"></span>
								</div>
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	
		<div class="filter-results" id="filter-results" style="display:none">
			<b class="filter-count">0</b> matching themes based on filters:
			<ul class="filter-crumb-list"></ul>
			<a class="filter-crumb-list-clear" href="#">Clear all</a>
		</div>
	
		<div class="themes clearfix" id="themes">
	
			<div class="theme" id="thm-business" data-tags="char_creator lipsync starters ext_lib qvm">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Business_Friendly.jpg" alt="Business Friendly">
					</div>
					<div class="theme-meat">
						<h3>Business Friendly</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=business');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=business');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
				<div class="theme-tag biz">Business Exclusive</div>
			</div>
	
			<div class="theme" id="thm-whiteboard" data-tags="char_creator lipsync">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Whiteboard_Animation.jpg" alt="Whiteboard Animation">
					</div>
					<div class="theme-meat">
						<h3>Whiteboard Animation</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=whiteboard');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=whiteboard');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
				<div class="theme-tag biz">Business Exclusive</div>
			</div>
	
			<div class="theme" id="thm-infographics" data-tags="">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/businessAsVisual.jpg" alt="Business as Visual">
					</div>
					<div class="theme-meat">
						<h3>Business as Visual</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=infographics');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
				<div class="theme-tag biz">Business Exclusive</div>
			</div>
	
			<div class="theme" id="thm-commoncraft" data-tags="">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Commoncraft.jpg" alt="Common Craft">
					</div>
					<div class="theme-meat">
						<h3>Common Craft</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=commoncraft');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
				<div class="theme-tag">$59 per year</div>
			</div>
	
			<div class="theme" id="thm-custom" data-tags="lipsync qvm char_creator">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Comedy_World.jpg" alt="Comedy World">
					</div>
					<div class="theme-meat">
						<h3>Comedy World</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=custom');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=family');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-action" data-tags="lipsync qvm char_creator">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/lil_Peepz.jpg" alt="Lil' Peepz">
					</div>
					<div class="theme-meat">
						<h3>Lil&#039; Peepz</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=action');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/cc?themeId=cc2&bs=default');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-sticklybiz" data-tags="">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Stickly_Business.jpg" alt="Stickly Business">
					</div>
					<div class="theme-meat">
						<h3>Stickly Business</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=sticklybiz');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
				<div class="theme-tag biz">Business Exclusive</div>
			</div>
	
			<div class="theme" id="thm-retro" data-tags="">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Cartoon_Classics.jpg" alt="Cartoon Classics">
					</div>
					<div class="theme-meat">
						<h3>Cartoon Classics</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=retro');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-politics2" data-tags="lipsync qvm">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Election_2012.jpg" alt="White Houserz">
					</div>
					<div class="theme-meat">
						<h3>White Houserz</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=election');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-anime" data-tags="char_creator lipsync qvm">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Anime.jpg" alt="Anime">
					</div>
					<div class="theme-meat">
						<h3>Anime</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=anime');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=anime');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-ninjaanime" data-tags="char_creator lipsync">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Ninja_Anime.jpg" alt="Ninja Anime">
					</div>
					<div class="theme-meat">
						<h3>Ninja Anime</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=ninjaanime');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=ninjaanime');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-spacecitizen" data-tags="lipsync">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Space_Citizens.jpg" alt="Space Citizens">
					</div>
					<div class="theme-meat">
						<h3>Space Citizens</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=spacecitizen');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-chibi" data-tags="lipsync qvm char_creator">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Chibi_Peepz.jpg" alt="Chibi Peepz">
					</div>
					<div class="theme-meat">
						<h3>Chibi Peepz</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=chibi');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=chibi');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-ninja" data-tags="lipsync qvm char_creator">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Chibi_Ninjas.jpg" alt="Chibi Ninjas">
					</div>
					<div class="theme-meat">
						<h3>Chibi Ninjas</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=ninja');" title="Video Maker">Make a Video</button>
							<button class="btn btn-icon" type="button" onclick="fullscreenStudio('/app/cc_browser?themeId=ninja');" title="Character Creator">Create a Char</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-space" data-tags="lipsync qvm">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Space_Peepz.jpg" alt="Space Peepz">
					</div>
					<div class="theme-meat">
						<h3>Space Peepz</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=space');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-stick" data-tags="">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Stick_Figure.jpg" alt="Stick Figure">
					</div>
					<div class="theme-meat">
						<h3>Stick Figure</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=stick');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-wildlife" data-tags="lipsync qvm">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://raw.githubusercontent.com/josephanimate2021/ga/zimmertwins-desktop-stable/files/wayback_zimmertwins.jpg" alt="Wildlife">
					</div>
					<div class="theme-meat">
						<h3>Zimmertwins</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('https://zimmertwins.onrender.com/starters');" title="Template">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
			<div class="theme" id="thm-animal" data-tags="lipsync qvm">
				<div class="theme-cell">
					<div class="theme-cover">
						<img src="https://josephanimate2021.github.io/static/477/go/img/videomaker/themes/Lil_Petz_World.jpg" alt="Lil' Petz World">
					</div>
					<div class="theme-meat">
						<h3>Lil&#039; Petz World</h3>
						<div class="apps">
							<button class="btn btn-${fUtil.color(req.headers.host)}" type="button" onclick="fullscreenStudio('/app/go_full?tray=animal');" title="Video Maker">Make a Video</button>
						</div>
					</div>
				</div>
			</div>
	
		</div>
	</div>
	
	<form style="display:none" enctype='multipart/form-data' action='/upload_movie' method='post'>
		<input id='movie' type="file" onchange="this.form.submit()" name='import' accept=".xml" />
	</form>
	<form style="display:none" enctype='multipart/form-data' action='/upload_character' method='post'>
		<input id='char' type="file" onchange="this.form.submit()" name='import' accept=".xml" />
	</form>
	
	<script>
	$(function() {
		$('.vm-tutorial-trigger').click(function(e) {
			e.preventDefault();
	
			var $tutorial = $('.vm-tutorial');
	
			if ($tutorial.hasClass('expand')) {
				$('.tutorial-video').hide();
				wistiaEmbed && wistiaEmbed.pause();
			} else {
				setTimeout(function() {
					$('.tutorial-video').show();
					wistiaEmbed && wistiaEmbed.play();
				}, 400);
			}
	
			$tutorial.toggleClass('expand');
		});
	
		$('.theme-cell').each(function() {
			var $button = $('.apps > .btn:first-child', this);
			var launch, url;
	
			$('.theme-cover', this).click(function(e) {
				e.preventDefault();
	
				if ($button.attr('href') != undefined) {
					window.location.href = $button.attr('href');
				} else {
					$button.trigger('click');
				}
			}).addClass('launch');
		});
	
		$('.vm-bf-content .btn-flat, .themes .apps > .btn').tooltip();
	});
	
	var tagNames = {"lipsync":"Lip-sync","ext_lib":"Extensive Library","starters":"Scene Starters","qvm":"Template","char_creator":"Character Creator"};
	</script>
	<script>$('#upload_movie').click(function() { document.getElementById("movie").click(); })</script>
	<script>$('#upload_char').click(function() { document.getElementById("char").click(); })</script>
	<script src="https://josephanimate2021.github.io/static/477/go/js/video_maker.js"></script>
	
	
	<!-- FOOTER -->
	
	<div class="site-footer">
		<div class="container clearfix">
		
			<div class="site-footer-nav clearfix">
				<div class="col" style="border-left: none;">
					<h5><span>About Redrawn</span></h5>
					<ul>
						<li><a href="https://github.com/RedrawnWrapper/Redrawn">Who we are</a></li>
						<li><a href="https://discord.gg/PnRGd96amY">Discord</a></li>
						<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/changelog.md?token=GHSAT0AAAAAABT2BKZIAW7G2UINSYE3V4FAYTNYLRQ">Update Log</a></li>
						<li><a href="/html/list.html">Your Videos</a></li>
					</ul>
				</div>
				<div class="col">
					<h5><span>GoAnimate Solutions</span></h5>
					<ul>
						<li><a href="https://youtube.com/@josephanimate">Joseph's Channel</a></li>
						<li><a href="https://discord.io/goanimate4schools" target="_blank">Joseph's Discord Server</a></li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
					</ul>
				</div>
				<div class="col">
					<h5><span>Usage Guidelines</span></h5>
					<ul>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
					</ul>
				</div>
				<div class="col" style="border-right: none;">
					<h5>Getting Help</h5>
					<ul>
						<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/faq.md?token=GHSAT0AAAAAABT2BKZIXY6CE6Y3JEHLK6LEYTNYMSQ">FAQ</a></li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
					</ul>
				</div>
			</div>
			<hr>
		
		
			<div class="clearfix">
				<div class="site-footer-socials-container">
					Follow us on:
					<ul class="site-footer-socials clearfix">
						<li><a class="youtube" href="http://www.youtube.com/@redrawnwrapper">YouTube</a></li>
					</ul>
				</div>
				<div class="site-footer-copyright" id="CopyrightYear"></div>
			</div>
		</div>
	</div>
	
	
	<div id="studio_container" style="display: none;">
		<div id="studio_holder"><!-- Full Screen Studio -->
			<div style="top: 50%; position: relative;">
				This content requires the Clean Flash Player 34. <a href="https://web.archive.org/web/20141204150606/http://get.adobe.com/flashplayer/">Get Flash</a>
			</div>
		</div>
	</div>
	<!-- END OF PAGE STRUCTURE -->
	
	</body>
	</html>`);
})
router.get("/home", (req, res) => {
	const p = url.parse(req.url, true);
	res.setHeader("Content-Type", "text/html; charset=utf8");
	res.send(`<!DOCTYPE html>
	<html>
	<head>
	
	<meta charset="utf-8">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<link rel="dns-prefetch" href="//josephanimate2021.github.io/">
	
	<title>Home - Redrawn</title>
	
	<meta name="viewport" content="width=device-width, initial-scale=1">
	
	<meta name="description" content="Make your own animation quickly and economically with GoAnimate. Reach prospects and customers with animated videos online about your business and products.">
	<meta property="og:site_name" content="GoAnimate">
	<meta property="fb:app_id" content="177116303202">
	
	<meta name="google-site-verification" content="K_niiTfCVi72gwvxK00O4NjsVybMutMUnc-ZnN6HUuA">
	
	<link rel="canonical" href="/app/home">
	<link rel="alternate" href="http://feeds.feedburner.com/GoAnimate" type="application/rss+xml" title="GoAnimate Blog">
	<link rel="alternate" href="http://feeds.feedburner.com/GoAnimate/WhatsNew" type="application/rss+xml" title="GoAnimate - Recently Released Content">
	<link rel="alternate" href="http://feeds.feedburner.com/GoAnimate/MostWatched" type="application/rss+xml" title="GoAnimate - Most Watched">
	<link href="https://redrawnwrapper.github.io/RedrawnDownload/static/a0cbfe8e1f619bcc/go/css/common_combined.css" rel="stylesheet" type="text/css">
	<link href="https://redrawnwrapper.github.io/RedrawnDownload/static/a0cbfe8e1f619bcc/go/css/site_responsive.css" rel="stylesheet" type="text/css">
	
	<link href="https://redrawnwrapper.github.io/RedrawnDownload/static/a0cbfe8e1f619bcc/go/css/business_video/home.css" rel="stylesheet" type="text/css">
	<!--[if lt IE 9]>
	<style text="text/css">
	.top-nav.collapse {height: auto;overflow: visible;}
	</style>
	<![endif]-->
	
	<script>
	var srv_tz_os = -5, view_name = "go", user_cookie_name = "u_info";
	</script>
	
	<script src="https://redrawnwrapper.github.io/RedrawnDownload/static/a0cbfe8e1f619bcc/go/js/common_combined.js"></script>
	<script type="text/javascript" src="https://redrawnwrapper.github.io/RedrawnDownload/static/a0cbfe8e1f619bcc/go/po/goserver_js-en_US.json"></script>
	<script type="text/javascript">
	var I18N_LANG = 'en_US';
	var GT = new Gettext({'locale_data': json_locale_data});
	</script>
	
	<script src="https://redrawnwrapper.github.io/RedrawnDownload/static/a0cbfe8e1f619bcc/go/js/jquery/jquery.waypoints2.min.js"></script>
	
	
	<script type="text/javascript" src="http://www.google.com/recaptcha/api/js/recaptcha_ajax.js"></script>
	
	<!-- Google Analytics -->
	<script type="text/javascript">
	var _gaq = _gaq || [];
	_gaq.push(['_setAccount', 'UA-2516970-1']);
	_gaq.push(['_setDomainName', 'none']);
	_gaq.push(['_trackPageview']);
	(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	
	ga.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'stats.g.doubleclick.net/dc.js';
	
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
	})();
	</script>
	
	<!-- GoAnimate_Footer_ROS_Bottom_960x284 -->
	<script type="text/javascript" src="http://partner.googleadservices.com/gampad/google_service.js">
	</script>
	<script type="text/javascript">
	GS_googleAddAdSenseService("ca-pub-9090384317741239");
	GS_googleEnableAllServices();
	</script>
	<script type="text/javascript">
	GA_googleAddAttr("is_login", "no");
	GA_googleAddAttr("is_plus", "no");
	GA_googleAddAttr("is_creator", "no");
	</script>
	<script type="text/javascript">
	GA_googleAddSlot("ca-pub-9090384317741239", "GoAnimate_Footer_ROS_Bottom_960x284");
	</script>
	<script type="text/javascript">
	GA_googleFetchAds();
	</script>
	<!-- GoAnimate_Footer_ROS_Bottom_960x284 -->
	
	
	<link href="https://plus.google.com/+goanimate" rel="publisher">
	
	</head>
	<body class="en_US">
	<script type="text/javascript">
	if (self !== top) {
				jQuery('body').hide();
		}
	</script>
	<div id="fb-root"></div>
	<script type="text/javascript">
	  window.fbAsyncInit = function() {
		FB.init({appId: '177116303202', cookie: true, status: true, xfbml: true});
		jQuery(document).ready(function() {
		  jQuery(document).trigger('facebook.init');
		});
	  };
	  (function() {
		var e = document.createElement('script'); e.async = true;
		e.src = document.location.protocol +
		  '//connect.facebook.net/en_US/all.js';
		document.getElementById('fb-root').appendChild(e);
	  }());
	</script>
	
	<script type="text/javascript">
	  var _kmq = _kmq || [];
	  var _kmk = _kmk || 'd6e9ca5d19bda4afea55a1493af00d0b98c26240';
	  function _kms(u){
		setTimeout(function(){
		  var d = document, f = d.getElementsByTagName('script')[0],
		  s = d.createElement('script');
		  s.type = 'text/javascript'; s.async = true; s.src = u;
		  f.parentNode.insertBefore(s, f);
		}, 1);
	  }
	  _kms('//i.kissmetrics.com/i.js');
	  _kms('//doug1izaerwt3.cloudfront.net/' + _kmk + '.1.js');
	</script>
	
	<script type="text/javascript">
			jQuery.extend(CCStandaloneBannerAdUI, {"actionshopSWF":"https:\/\/web.archive.org\/web\/20141204150401\/http:\/\/lightspeed.goanimate.com\/animation\/ad1b4b02721506d6\/actionshop.swf","apiserver":"https:\/\/web.archive.org\/web\/20141204150401\/http:\/\/goanimate.com\/","clientThemePath":"https:\/\/web.archive.org\/web\/20141204150401\/http:\/\/lightspeed.goanimate.com\/static\/a0cbfe8e1f619bcc\/<client_theme>","userId":""});
	</script>
	
	<div class="page-container">
	
	<!-- HEADER -->
	<div class="site-header">
		<div class="container site-header-inside clearfix">
			<a class="site-logo" href="/app/home" title="Redrawn">
				<img alt="Make a Video With Redrawn" src="${fUtil.logo(req.headers.host)}">
			</a>
	
			<button type="button" class="top-nav-toggle" data-toggle="collapse" data-target="#top-nav">
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
				<span class="icon-bar"></span>
			</button>
	
				<ul id="top-nav" class="top-nav collapse">
					<li><a id="upload_movie">Upload A Movie</a></li>
					<li><a href="/recorder">Anistick Recorder</a></li>
					<li class="dropdown">
						<a class="dropdown-toggle" href="/html/list.html" data-toggle="dropdown">Explore <span class="caret"></span></a>
						<ul class="dropdown-menu">
							<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/changelog.md?token=GHSAT0AAAAAABT2BKZIAW7G2UINSYE3V4FAYTNYLRQ">Update Log</a></li>
							<li><a href="https://youtube.com/@josephanimate">Joseph's YouTube Channel</a></li>
							<li><a href="/html/list.html">Your Videos</a></li>
							<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/faq.md?token=GHSAT0AAAAAABT2BKZIXY6CE6Y3JEHLK6LEYTNYMSQ">FAQ</a></li>
						</ul>
					</li>
					<li>
						<a class="bright" href="https://goanimate-wrapper-repl.joseph-animate.repl.co/">GAWrapper</a>
					</li>
					<li class="top-nav-vm-btn">
						<span><a class="btn btn-${fUtil.color(req.headers.host)}" href="/app/videomaker">Make a Video</a></span>
					</li>
				</ul>
	
		</div>
	</div>
	
	<!-- END OF HEADER -->
	
		<div class="hp-main">
			<div class="to-features"><a href="#features"><span class="arrow">Features</span></a></div>
			<div class="home">
				<div class="container">
					<div class="home-content">
					    <h1>A new LVM for GoAnimators...<small>Making GoAnimate simple, quick, and enjoyable.</small></h1>
					</div>
				</div>
			</div>
		</div>
	
		<div class="features" id="features">
            <div class="container">
                <h2>No Headaches, No Problems</h2>

                <div class="row">
                    <div class="span4 feature">
                        <img src="//josephanimate2021.github.io/static/477/go/img/business_video/home/video-equipment.png" alt="Video Equipment">
                        <h3>Get started right away</h3>
                        <p>You just need flash, a browser, and Node.JS. A few clicks to run Redrawn.</p>
                    </div>

                    <div class="span4 feature">
                        <img src="//josephanimate2021.github.io/static/477/go/img/business_video/home/team-and-budget.png" alt="Team and Budget">
                        <h3>Turn Ideas Into Videos</h3>
                        <p>Redrawn is created for people who want to turn their ideas into a real thing without issues.</p>
                    </div>
                    <div class="span4 feature">
                        <img src="//josephanimate2021.github.io/static/477/go/img/business_video/home/animated-video.png" alt="Animated Video">
                        <h3>Free and Open Source</h3>
                        <p>Redrawn is free to contribute, download, or modify. We enjoy people using our LVM!</p>
                    </div>
                </div>
            </div>
        </div>
	
	
		<div class="sample-videos">
        <div class="container">
            <h2>Your Videos</h2>

            <div class="videos-container clearfix">${list.map(v => v.html)}</div>
			<p>Note: Your videos might not always update live here unless you restart localhost. so it's best if your view your videos in the <a href="/html/list.html">Video List</a>.</p>
        </div><form style="display:none" enctype='multipart/form-data' action='/upload_movie' method='post'>
		<input id='movie' type="file" onchange="this.form.submit()" name='import' accept=".xml" />
	</form>

        <!-- Video player container -->
        <div class="modal video-modal hide" id="sample-video-modal">
            <button class="close" data-dismiss="modal">&#215;</button>
            <div class="video-modal-content" id="sample-video-player"></div>
        </div></div>
	
		<div class="plans">
			<div class="container">
				<span>Green light your video</span>
	
				<a class="btn btn-large btn-${fUtil.color(req.headers.host)}" href="/app/videomaker">Make A Video</a>
				<a class="btn btn-large btn-dark" href="https://vyond.letsjoincdm.tk/">Beta Version Of Redrawn Online</a>
			</div>
		</div>
	
	<script charset="ISO-8859-1" src="http://fast.wistia.com/static/concat/E-v1.js"></script>
	<script charset="ISO-8859-1" src="http://fast.wistia.com/embed/medias/b9wtido8pl/metadata.js"></script>
	<script>
	$('.video-holder').click(function(e) {
		e.preventDefault();
		var src = $(this).data('video');
		if (!src) return;
		$('#sample-video-modal').modal({keyboard: true, backdrop: true}).on('hidden', function() {
			$('#sample-video-player').empty();
		});
		var player = $('<iframe width="800" height="450" frameborder="0" allowfullscreen></iframe>').attr('src', src);
		$('#sample-video-player').empty().append(player);
	})
	</script>
	
	
	<script type="text/javascript">
	setTimeout(function(){var a=document.createElement("script");
	var b=document.getElementsByTagName("script")[0];
	a.src=document.location.protocol+"//dnn506yrbagrg.cloudfront.net/pages/scripts/0017/4526.js?"+Math.floor(new Date().getTime()/3600000);
	a.async=true;a.type="text/javascript";b.parentNode.insertBefore(a,b)}, 1);
	</script><script>$('#upload_movie').click(function() { document.getElementById("movie").click(); })</script>
	
	<!-- FOOTER -->
	
	<div class="site-footer">
		<div class="container clearfix">
	
			<div class="site-footer-nav clearfix">
				<div class="col" style="border-left: none;">
					<h5><span>About Redrawn</span></h5>
					<ul>
						<li><a href="https://github.com/RedrawnWrapper/Redrawn">Who we are</a></li>
						<li><a href="https://discord.gg/BYaM76Arhx">Discord</a></li>
						<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/changelog.md?token=GHSAT0AAAAAABT2BKZIAW7G2UINSYE3V4FAYTNYLRQ">Update Log</a></li>
						<li><a href="/html/list.html">Your Videos</a></li>
					</ul>
				</div>
				<div class="col">
					<h5><span>GoAnimate Solutions</span></h5>
					<ul>
						<li><a href="https://youtube.com/@josephanimate">Joseph's Channel</a></li>
						<li><a href="https://discord.io/goanimate4schools" target="_blank">Joseph's Discord Server</a></li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
					</ul>
				</div>
				<div class="col">
					<h5><span>Usage Guidelines</span></h5>
					<ul>
					    <li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
					</ul>
				</div>
				<div class="col" style="border-right: none;">
					<h5>Getting Help</h5>
					<ul>
						<li><a href="https://raw.githubusercontent.com/RedrawnWrapper/Redrawn/main/faq.md?token=GHSAT0AAAAAABT2BKZIXY6CE6Y3JEHLK6LEYTNYMSQ">FAQ</a></li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
						<li class="dummy">&nbsp;</li>
					</ul>
				</div>
			</div>
			<hr>
	
	
			<div class="clearfix">
				<div class="site-footer-socials-container">
					Follow us on:
					<ul class="site-footer-socials clearfix">
						<li><a class="youtube" href="http://www.youtube.com/@redrawnwrapper">YouTube</a></li>
					</ul>
				</div>
				<div class="site-footer-copyright">
					&nbsp;&nbsp;&nbsp;
					Redrawn &copy; ${fUtil.getYear()}
				</div>
			</div>
		</div>
	</div>
	
	
	<div id="studio_container" style="display: none;">
		<div id="studio_holder"><!-- Full Screen Studio -->
			<div style="top: 50%; position: relative;">
				This content requires the Clean Flash Player 34. <a href="https://gitlab.com/cleanflash/installer/-/releases">Get Flash</a>
			</div>
		</div>
	</div>
	
	</div>
	<!-- END OF PAGE STRUCTURE -->
	
	</body>
	</html>`);
})

router.get("/home", (req, res) => {
	const p = url.parse(req.url, true);
	res.setHeader("Content-Type", "text/html; charset=utf8");
	res.sendFile(path.join(__dirname, "../html/home.html"));
})
module.exports = router;
