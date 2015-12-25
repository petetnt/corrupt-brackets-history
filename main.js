/** 
 * @license
 * The MIT License (MIT)
 * 
 * Copyright (c) 2015 Pete Nykänen
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 **/
define(function (require, exports, module) {
    "use strict";

    var AppInit           = brackets.getModule("utils/AppInit");
    var EditorManager     = brackets.getModule("editor/EditorManager");
    var CommandManager    = brackets.getModule("command/CommandManager");
    var Commands          = brackets.getModule("command/Commands");
    var KeyBindingManager = brackets.getModule("command/KeyBindingManager");
    var Menus		      = brackets.getModule("command/Menus");
    
    var MAX_CORRUPTION_TRIES = 50;
    var _previousHistoryLength = null;
    var _corruptionTries = 0;
    var _counter = 1;

    /**
     * Tries to corrupt Brackets history by continuously writing and saving to the active file
     */
    function _trytoCorrupt() {
        var editor = EditorManager.getFocusedEditor();
        if (editor) {
            editor._codeMirror.doc.setValue("Try " + _corruptionTries);
            var history = editor._codeMirror.doc.history;
            var historyLength = history.done.length;
            
            if (historyLength === 3) {
                console.warn("Brackets history most likely corrupted, see Developer Tools -> Profiles for profile. It took " + _corruptionTries + " saves to corrupt the history. History object looks like this:");
                console.log(history);
                _corruptionTries = 0;
                
                console.profileEnd();                
                debugger;
            } else {
                CommandManager.execute(Commands.FILE_SAVE).done(function() {

                    _corruptionTries = _corruptionTries + 1;
                    _counter = _counter + 1;

                    if (_counter <= MAX_CORRUPTION_TRIES) {
                        _trytoCorrupt();
                    } else {
                        console.log("Failed to corrupt Brackets history. Wrote to the file " + MAX_CORRUPTION_TRIES + " times");
                        
                        console.profileEnd();
                    }
                });
            }
        }
    }

    /**
     * Starts trying to corrupt the history / profile the issue
     */
    function _startCorrupting() {
        console.profile("Brackets history corruption profile");
        _counter = 1;
        _trytoCorrupt();
    }

    // Register command and shortcuts
    var COMMAND_ID = "corrupt-brackets-history.tryToCorrupt";
    CommandManager.register("Try to Corrupt", COMMAND_ID, _startCorrupting);
    KeyBindingManager.addBinding(COMMAND_ID, "Ctrl-Alt-C");
    
    // Add menu item under File -> 
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(COMMAND_ID);
});