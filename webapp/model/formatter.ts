import ResourceBundle from "sap/base/i18n/ResourceBundle";
import Controller from "sap/ui/core/mvc/Controller";
import ResourceModel from "sap/ui/model/resource/ResourceModel";

export default {
    statusText: function (this: Controller, status: string, ...statuses: string[]): string | undefined {
        // const resourceBundle = (this?.getOwnerComponent()?.getModel("i18n") as ResourceModel)?.getResourceBundle() as ResourceBundle;
        // switch (status) {
        //     case "A":
        //         return resourceBundle.getText("invoiceStatusA");
        //     case "B":
        //         return resourceBundle.getText("invoiceStatusB");
        //     case "C":
        //         return resourceBundle.getText("invoiceStatusC");
        //     default:
        //         return status;
        // }


        switch (status) {
            case "A":
                return statuses[0];
            case "B":
                return statuses[1];
            case "C":
                return statuses[2];
            default:
                return status;
        }
    }
};