import * as ExtensionContracts from "TFS/WorkItemTracking/ExtensionContracts";
import * as Q from 'q';
import * as marked from 'marked';

const getDefinitionsOfDone = () => {
    var deferred = Q.defer<string>();
    
    VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: any) => {
        dataService.getValue("evilduck-dod-url").then((value: string) => {
            deferred.resolve(value);
        });
    });

    return deferred.promise;
};

const saveDefinitionsOfDone = (content: string) => {
    var deferred = Q.defer();

    VSS.getService(VSS.ServiceIds.ExtensionData).then((dataService: any) => {
        dataService.setValue("evilduck-dod-url", content).then(() => {
            deferred.resolve();
        });
    });

    return deferred.promise;
};

const logicProvider = () => {
    return {
        onLoaded: (args: ExtensionContracts.IWorkItemLoadedArgs) => {

            const $dodEditor: JQuery = $('#dodEditor');
            const $dodDisplay: JQuery = $('#dodDisplay');
            const $displayMode: JQuery = $('#displayMode');
            const $editorMode: JQuery = $('#editorMode');
            const $editorPanel: JQuery = $('#editorPanel');
            const $displayPanel: JQuery = $('#displayPanel');

            $editorPanel.hide();

            const displayMode = () => {
                $editorPanel.hide();
                $displayPanel.show();
            };

            const editorMode = () => {
                $editorPanel.show();
                $displayPanel.hide();
            };

            $displayMode.on('click', () => {
              displayMode();  
            });

            $editorMode.on('click', () => {
                editorMode();
            })

            getDefinitionsOfDone().then((content: string) => {
                $dodEditor.val(content);
                $dodDisplay.html(marked(content));
            });

            $('#saveBtn').on('click', () => {

                const newContent: string = $dodEditor.val();

                saveDefinitionsOfDone(newContent).then(() => {
                    $dodDisplay.html(marked(newContent));
                    displayMode();
                });

            });
        }
    };
};

VSS.register(VSS.getContribution().id, logicProvider);