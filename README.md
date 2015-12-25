# Brackets Corrupt History

This extension has been created for debugging https://github.com/adobe/brackets/issues/11826, the notorious undo history reset history.

## How to use

1. Install the extension
2. Open an empty file
3. Open Developer Tools (F12)
4. Select `File -> Try to Corrupt (Ctrl+Alt+C)` or hit `Ctrl+Alt+C` to start the script
  - The script writes and then saves to the current document 50 times in a row
  - Before and after saving the script checks the length of Codemirros History.done array. You will see one of the following messages:
    - When the script finishes, you should see "Failed to corrupt Brackets history. Wrote to the file 50 times"
    - However, if the saving corrupted the history, you will see a warning saying that "Brackets history most likely corrupted, see Developer Tools -> Profiles for profile. It took %XXX tries% saves to corrupt the history. History object looks like this: %history%". Go to `Developer Tools -> Profile -> Brackets history corruption profile` and search for "_tryToCorrupt". Select the second to last one and start debugging.
    
    
## Warning

This extension should be used for debugging issue https://github.com/adobe/brackets/issues/11826 only. It **should be** used on **empty** or otherwise worthless files only as it **can** and **will** destroy the file. Use at your own discretion.

## Q&A

### It doesn't seem to work
It does work but like the issue on GitHub proves, it's terribly inconsistent. Just re-run the script until the error occurs: sometimes it can take more than 1000 saves to happen.

### I see an error `Failed to create temp file 2 : It was determined that certain files are unsafe for access within a Web application, or that too many calls are being made on file resources`.

Not sure what's up with that: it's caused by `console.profileEnd()`. Feel free to ignore it. 

### 50 tries is too little/too much

Open `main.js` in the extension and change the value of `MAX_CORRUPTION_TRIES`

## License
MIT