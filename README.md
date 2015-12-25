# Brackets Corrupt History

This extension has been created for debugging https://github.com/adobe/brackets/issues/11826, the notorious undo history reset history.

## How to use

1. Install the extension
2. Open an empty file
3. Open Developer Tools (F12)
4. Select `File -> Try to Corrupt (Ctrl+Alt+C)` or hit `Ctrl+Alt+C` to start the script
  - The script writes and then saves to the current document 50 times in a row
  - Before and after saving the script checks the length of CodeMirror's `document.history.done` array.

When the script finishes, you should see a message in the console saying that *"Failed to corrupt Brackets history. Wrote to the file 50 times"*.

However, if the history got corrupted during the process (the length of the `history.done` array is suddenly `3`), you will see a warning saying that *"Brackets history most likely corrupted, see Developer Tools -> Profiles for profile. It took `amount of` saves to corrupt the history. History object looks like this: `[Object history]`"*. 
    
Go to `Developer Tools -> Profile -> Brackets history corruption profile` and search for `_tryToCorrupt`. Select the the last one and start debugging.
    
    
## Warning

This extension should be used for debugging issue https://github.com/adobe/brackets/issues/11826 only. It **should be** used on **empty** or otherwise worthless files only as it **can** and **will** destroy the file. Use at your own discretion.

## Q&A

#### It doesn't seem to work

It does work but like the issue on GitHub proves, it's terribly inconsistent. Just re-run the script until the error occurs: sometimes it can take more than 1000 saves to happen.

####  I see an error.

If the error is `Failed to create temp file 2 : It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources`, not sure what's up with that: it's caused by `console.profileEnd()`. Feel free to ignore it. 

#### 50 tries is too little/too much

Open `main.js` in the extension and change the value of `MAX_CORRUPTION_TRIES`

## License
MIT