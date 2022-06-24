class GraphicDialogPresenter extends DialogPresenter {
    constructor(dialogManager) {
        super();
        this.dialogManager = dialogManager;
        this.createElements();
        this.setListeners();
    }

    setListeners() {
        this.dialogManager.addEventListener(
            DialogManager.Events.CONVERSATION_STARTED, 
            x => this.showDialog());

        this.dialogManager.addEventListener(
            DialogManager.Events.CONVERSATION_ENDED, 
            x => this.hideDialog());

        this.dialogManager.addEventListener(
            DialogManager.Events.DIALOG_CHANGED, 
            x => this.display(x));
    }

    showDialog() {
        this.dialogBox.hidden = false;
    }

    hideDialog() {
        this.dialogBox.hidden = true;
    }

    display(dialog) {
        this.dialogTitle.innerHTML = dialog.author;
        this.dialogSubtitle.hidden = !dialog.authorTitle;
        this.dialogSubtitle.innerHTML = dialog.authorTitle;
        this.dialogText.innerHTML = "";
        var textCharacters = dialog.message.split("");
        for(var characterIndex in textCharacters) {
            setTimeout((dialogTextElement, character) => {
                dialogTextElement.innerHTML = dialogTextElement.innerHTML + character;
            }, 50 * characterIndex, this.dialogText, textCharacters[characterIndex]);
        }
    }

    createElements() {
        this.dialogBox = document.createElement("div");
        this.dialogBox.classList.add("graphic-dialog-box");
        this.dialogBox.hidden = true;
        
        this.dialogTitle = document.createElement("h3");
        this.dialogTitle.classList.add("graphic-dialog-title", "mb-0")
        
        this.dialogSubtitle = document.createElement("small", "text-muted");
        this.dialogSubtitle.classList.add("graphic-dialog-subtitle")
        
        this.dialogText = document.createElement("p");
        this.dialogText.classList.add("graphic-dialog-text", "lead");
        this.dialogBox.append(this.dialogTitle, this.dialogSubtitle, this.dialogText);

        document.body.append(this.dialogBox);
    }
}