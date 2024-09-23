# Get the values from the .env file - skip lines that start with #
$envFile = Get-Content .\src\.env
$envVars = $envFile | ForEach-Object {
	if ($_.StartsWith("#")) {
		return
	}

	$key, $value = $_ -split '=', 2
	"--build-arg $key=$value"
}

$command = "docker build -t tipgift:latest $envVars ."

# echo $command

Invoke-Expression $command

echo 'Done! Now do "docker run --publish 3000:3000 tipgift:latest" to start the app!'
