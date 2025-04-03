$WshShell = New-Object -ComObject WScript.Shell

# Create the Start Menu shortcut

New-Item -ItemType Directory -Force -Path "$env:AllUsersProfile\Start Menu\Programs\"

$Shortcut = $WshShell.CreateShortcut("$env:AllUsersProfile\Start Menu\Programs\Edge.lnk")

$Shortcut.TargetPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$Shortcut.Arguments = " --user-data-dir=`"C:\Users\Public\AppData\Local\Microsoft\Edge\User Data`" --no-first-run"

$Shortcut.WorkingDirectory = "C:\Program Files (x86)\Microsoft\Edge\Application"

$Shortcut.Save()