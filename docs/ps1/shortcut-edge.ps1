$WshShell = New-Object -ComObject WScript.Shell

# Create the Start Menu shortcut

New-Item -ItemType Directory -Force -Path "$env:Public\Start Menu\Programs\"

$Shortcut = $WshShell.CreateShortcut("$env:Public\Start Menu\Programs\Microsoft Edge.lnk")

$Shortcut.TargetPath = "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe"

$Shortcut.Arguments = " --user-data-dir=`"C:\Users\Public\AppData\Local\Microsoft\Edge\User Data`" --no-first-run"

$Shortcut.WorkingDirectory = "C:\Program Files (x86)\Microsoft\Edge\Application"

$Shortcut.Save()