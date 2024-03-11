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
    Write-Host "Change detected in $changedFile. Attempting to commit..."
    Push-Location -Path $repoDir
    $output = git add $changedFile 2>&1
    Write-Host "git add output: $output"
    $commitMessage = "Auto-commit: $($changedFile) changed"
    $commitOutput = git commit -m $commitMessage 2>&1
    Write-Host "git commit output: $commitOutput"
    if ($commitOutput -match "nothing to commit") {
        Write-Host "No changes detected by Git. Skipping push."
    } else {
        $pushOutput = git push 2>&1
        Write-Host "git push output: $pushOutput"
    }
    Pop-Location
}


# Function for manual testing of the commit function
function ManualTest-Commit {
    param (
        [string]$testFile
    )
    Commit-FileChange -changedFile $testFile
}

# Watcher setup for each file
$watchers = @($file1, $file2) | ForEach-Object {
    $watcher = New-Object System.IO.FileSystemWatcher
    $watcher.Path = [System.IO.Path]::GetDirectoryName($_)
    $watcher.Filter = [System.IO.Path]::GetFileName($_)
    $watcher.IncludeSubdirectories = $false
    $watcher.EnableRaisingEvents = $true

    Register-ObjectEvent -InputObject $watcher -EventName "Changed" -Action {
        $changedPath = $Event.SourceEventArgs.FullPath
        Write-Host "Event detected for $changedPath"
        Commit-FileChange -changedFile $changedPath
    }

    $watcher
}

Write-Host "Watching for changes to $file1 and $file2. Press Ctrl+C to exit..."

# To manually test, call ManualTest-Commit with the path to the file you want to test committing.
# For example:
# ManualTest-Commit -testFile $file1

# Prevent the script from exiting immediately
while ($true) {
    Start-Sleep -Seconds 2
}
