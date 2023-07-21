$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\Lobo\Documents\GitHub\Karen"
$watcher.Filter = "dem_words.js"
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$action = {
    $file = Get-Item -Path $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    Write-Host "File $file $changeType"

    git -C "C:\Users\Lobo\Documents\GitHub\Karen" add dem_words.js
    git -C "C:\Users\Lobo\Documents\GitHub\Karen" commit -m "Automatic commit on file change" --allow-empty
    git -C "C:\Users\Lobo\Documents\GitHub\Karen" push origin main
}

Register-ObjectEvent $watcher "Changed" -Action $action

while ($true) {
    Start-Sleep -Seconds 1
}
