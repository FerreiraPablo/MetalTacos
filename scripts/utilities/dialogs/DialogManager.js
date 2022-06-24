class DialogManager extends EventListener {
    currentDialog;
    dialogs;

    constructor() {
        super();
    }

    startConversation(dialogs) {
        this.currentDialog = null;
        this.dialogs = dialogs;
        this.trigger(DialogManager.Events.CONVERSATION_STARTED);
        this.next();
    }

    next() {
        if(!this.dialogs) 
            return;
            
        if(!this.currentDialog)  {
            this.currentDialog = this.dialogs[0];
        } else {
            var currentDialogPosition = this.dialogs.indexOf(this.currentDialog);
            var nextDialog = currentDialogPosition + 1;
            if(this.dialogs[nextDialog]) {
               this.currentDialog = this.dialogs[nextDialog];
            } else {
                this.currentDialog = null;
                this.endConversation();
                return;
            }
        }

        if(this.currentDialog.trigger) 
            this.currentDialog.trigger();

        this.trigger(DialogManager.Events.DIALOG_CHANGED, this.currentDialog);
    }

    endConversation() {
        this.currentDialog = this.dialogs = null;
        this.trigger(DialogManager.Events.CONVERSATION_ENDED);
    }
}

DialogManager.Events = {
    "CONVERSATION_ENDED": "conversation ended",
    "CONVERSATION_STARTED": "conversation started",
    "DIALOG_CHANGED": "dialog changed"
}