<?php
	header("content-type: application/json");
	echo(json_encode(glob("*.mp3")));