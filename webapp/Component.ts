import UIComponent from "sap/ui/core/UIComponent";
import JSONModel from "sap/ui/model/json/JSONModel";
import Device from "sap/ui/Device";

/**
 * @namespace ui5.walkthrough
 */
export default class Component extends UIComponent {
    public static metadata = {
        "interfaces": ["sap.ui.core.IAsyncContentCreation"],
        "manifest": "json"
    };
    init(): void {
        // call the init function of the parent
        super.init();

        // set data model
        const data = {
            recipient: {
                name: "World"
            }
        };
        const model = new JSONModel(data);
        this.setModel(model);

        // history menu
        const historyModel = new JSONModel({
            navigationHistory: []
        });
        this.setModel(historyModel, "history");

        const eventBus = this.getEventBus();
        eventBus?.subscribe("channelHistory", "eventHistory", this.addNavigationToHistory, this);
        eventBus?.subscribe("channelHistoryRm", "eventHistoryRm", this.removeNavigationToHistory, this);

        // set device model
        const deviceModel = new JSONModel(Device);
        deviceModel.setDefaultBindingMode("OneWay");
        this.setModel(deviceModel, "device");

        // init router
        this.getRouter().initialize();
    };

    addNavigationToHistory(channel: string, event: string, data: Object): void {
        const dataN = data as { route: string; title: string }

        const historyModel = this.getModel("history") as JSONModel;
        const navigationHistory = historyModel.getProperty("/navigationHistory") || [];
        navigationHistory.unshift({
            id: navigationHistory.length,
            title: dataN.title,
            route: dataN.route
        });
        console.log(navigationHistory);

        historyModel.setProperty("/navigationHistory", navigationHistory);
    }

    removeNavigationToHistory(channel: string, event: string, data: Object): void {
        const dataN = data as { id: number }

        const historyModel = this.getModel("history") as JSONModel;
        const navigationHistory = historyModel.getProperty("/navigationHistory") || [];

        if (dataN.id === -1) {
            navigationHistory.splice(0, 1)
        } else {
            navigationHistory.splice(0, navigationHistory.length - dataN.id)
        }

        historyModel.setProperty("/navigationHistory", navigationHistory);
    }
};