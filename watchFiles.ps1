# Define the paths to the files you want to watch
$file1 = "C:\Users\Lobo\Documents\GitHub\Karen\dem_tags.js"
$file2 = "C:\Users\Lobo\Documents\GitHub\Karen\dem_words.js"

# Your Git repository directory
$repoDir = "C:\Users\Lobo\Documents\GitHub\Karen"

# Function to handle file changes and commit them
function Commit-FileChange {
    param (
        [string]$changedFile
    )
    Push-Location -Path $repoDir
    git add $changedFile
    $commitMessage = "Auto-commit: $($changedFile) changed"
    git commit -m $commitMessage
    git push
    Pop-Location
}

# Watcher setup for each file
$watchers = @($file1, $file2) | ForEach-Object {
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = [System.IO.Path]::GetDirectoryName($_)
    $watcher.Filter = [System.IO.Path]::GetFileName($_)
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true

    Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
        Commit-FileChange $Event.SourceEventArgs.FullPath
    }

    $watcher
}

Write-Host "Watching for changes to $file1 and $file2. Press Ctrl+C to exit..."

# Prevent the script from exiting immediately
while ($true) {
    Start-Sleep -Seconds 2
}
