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

    function _reset() {
        _corruptionTries = 0;
    }

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

    function _startCorrupting() {
        console.profile("Brackets history corruption profile");
        _counter = 1;
        _trytoCorrupt();
    }

    var COMMAND_ID = "corrupt-brackets-history.tryToCorrupt";
    CommandManager.register("Try to Corrupt", COMMAND_ID, _startCorrupting);
    KeyBindingManager.addBinding(COMMAND_ID, "Ctrl-Alt-C");
    var menu = Menus.getMenu(Menus.AppMenuBar.FILE_MENU);
    menu.addMenuItem(COMMAND_ID);
});