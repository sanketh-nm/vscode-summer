// The module 'vscode' contains the VS Code extensibility API
// Import the necessary extensibility types to use in your code below
import {window, commands, Disposable, ExtensionContext, StatusBarAlignment, StatusBarItem, TextDocument} from 'vscode';

// This method is called when your extension is activated. Activation is
// controlled by the activation events defined in package.json.
export function activate(context: ExtensionContext) {

   // Use the console to output diagnostic information (console.log) and errors (console.error).
// This line of code will only be executed once when your extension is activated.
console.log('Congratulations, your extension "WordCount" is now active!');

// create a new word counter
let wordCounter = new Summer();
let controller = new SummerController(wordCounter);

// Add to a list of disposables which are disposed when this extension is deactivated.
context.subscriptions.push(controller);
context.subscriptions.push(wordCounter);
}

class Summer {

    private _statusBarItem: StatusBarItem =  window.createStatusBarItem(StatusBarAlignment.Left);

    public updateSum() {
       

        // Get the current text editor
        let editor = window.activeTextEditor;
        if (!editor) {
            this._statusBarItem.hide();
            return;
        }

        let doc = editor.document;

        // Only update statusbar if an xml file
        if (doc.languageId === "xml") {

            let selection = editor.selection;
            let text = editor.document.getText(selection);
            let wordCount = this.getSum(doc, text);
            let i: number =0;
            let sum: number =0;
            for( i=0 ;i< wordCount.length; i++){
                  sum = sum + wordCount[i];
                 }
            // Update the status bar
            this._statusBarItem.text = sum !== 0 ? `Total ${text} : ${sum}` : 'Price 0';
            this._statusBarItem.show();
        } else {
            console.log("hiding stat bar");
            this._statusBarItem.hide();
        }
    }

    public getSum(doc: TextDocument, selection: string): number[] {

        let docContent = doc.getText();
 
        let line : string = "";
        let count : number[] = [0];
        let i:number =0;
        let qty: number = 0;
        if (docContent !== "") {
            let lines : string[]  = docContent.split("\n");
            for(line of lines){
                if(line.includes(selection)){
                    line = line.replace(/[^0-9.]/g,'');
                    count[i] = parseFloat(line);
                    i++;
                }
            }
        }
        console.log(count);
        return count;
    }

    dispose() {
        this._statusBarItem.dispose();
    }
    
}
class SummerController {

    private _summer: Summer;
    private _disposable: Disposable;

    constructor(Summer: Summer) {
        this._summer = Summer;

        // subscribe to selection change and editor activation events
        let subscriptions: Disposable[] = [];
        window.onDidChangeTextEditorSelection(this._onEvent, this, subscriptions);
        window.onDidChangeActiveTextEditor(this._onEvent, this, subscriptions);

        // update the counter for the current file
        this._summer.updateSum();

        // create a combined disposable from both event subscriptions
        this._disposable = Disposable.from(...subscriptions);
    }

    dispose() {
        this._disposable.dispose();
    }

    private _onEvent() {
        console.log("event");
        this._summer.updateSum();
    }
}