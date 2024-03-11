$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = "C:\Users\Lobo\Documents\GitHub\Karen"
$watcher.Filter = "*" # Watch for all files
$watcher.IncludeSubdirectories = $false
$watcher.EnableRaisingEvents = $true

$action = {
    $file = Get-Item -Path $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    Write-Host "File $file $changeType"

    # Check if the changed file is one of the ones we're interested in
    if ($file.Name -eq "dem_words.js" -or $file.Name -eq "dem_tags.js") {
        git -C "C:\Users\Lobo\Documents\GitHub\Karen" add $file.Name
        git -C "C:\Users\Lobo\Documents\GitHub\Karen" commit -m "Automatic commit on $file $changeType"
        git -C "C:\Users\Lobo\Documents\GitHub\Karen" push origin main
    }
}
Register-ObjectEvent $watcher "Changed" -Action $action
Register-ObjectEvent $watcher "Created" -Action $action

while ($true) {
    Start-Sleep -Seconds 1
}
