import Controller from "sap/ui/core/mvc/Controller";
import UIComponent from "sap/ui/core/UIComponent";
import { Route$PatternMatchedEvent } from "sap/ui/core/routing/Route";
import History from "sap/ui/core/routing/History";
import Event from "sap/ui/base/Event";
import Button from "sap/m/Button";
import Popover from "sap/m/Popover";
import Page from "sap/m/Page";
import MessageToast from "sap/m/MessageToast";
import ProductRating, { ProductRating$ChangeEvent } from "../control/ProductRating";
import ResourceBundle from "sap/base/i18n/ResourceBundle";
import ResourceModel from "sap/ui/model/resource/ResourceModel";
import JSONModel from "sap/ui/model/json/JSONModel";

/**
 * @namespace ui5.walkthrough.controller
 */
export default class Detail extends Controller {

    private historyMenu: Popover;
    private oButton: Button;
    onInit(): void {
        const viewModel = new JSONModel({
            currency: "EUR"
        });
        this.getView().setModel(viewModel, "view");

        const router = UIComponent.getRouterFor(this);
        router.getRoute("detail")?.attachPatternMatched(this.onObjectMatched, this);

        const oPage = this.byId("detailPage") as Page;

        // Access the internal navButton (use with caution as _navButton is private)
        this.oButton = (oPage as any)._navBtn as Button;

        if (this.oButton) {
            // Add delegate for the contextmenu event
            this.oButton.addEventDelegate({
                oncontextmenu: (oEvent: Event) => {
                    // Prevent the default browser context menu
                    oEvent.preventDefault();
                    // Call the onOpenHistoryMenu function
                    this.onOpenHistoryMenu(oEvent);
                }
            });
        } else {
            console.log("null");
        }
    }

    onObjectMatched(event: Route$PatternMatchedEvent): void {

        (<ProductRating>this.byId("rating")).reset();

        this.getView()?.bindElement({
            path: "/" + window.decodeURIComponent((event.getParameter("arguments") as any).invoicePath),
            model: "invoice"
        })
    }

    onNavBack(): void {
        const history = History.getInstance();
        const previousHash = history.getPreviousHash();

        if (previousHash !== undefined) {

            const eventBus = this.getOwnerComponent()?.getEventBus();
            eventBus?.publish("channelHistoryRm", "eventHistoryRm", {
                id: -1
            });

            window.history.go(-1);
        } else {
            const router = UIComponent.getRouterFor(this);

            router.navTo("overview", {}, true);
        }
    }

    async onOpenHistoryMenu(event: Event): Promise<void> {
        // const selectedItem1 = event.getSource() as Button;
        // console.log("start", selectedItem1);
        this.historyMenu ??= await this.loadFragment({
            name: "ui5.walkthrough.view.History"
        }) as Popover;
        console.log("start1", this.historyMenu);
        const popover = this.byId("historyPopover") as Popover;
        this.historyMenu.openBy(this.oButton);
    }

    onNavigateFromHistory(event: Event): void {
        const selectedItem = event.getSource() as Button;
        const route = selectedItem.getBindingContext("history")?.getProperty("route");
        const router = UIComponent.getRouterFor(this);
        console.log("1");
        if (route) {

            const eventBus = this.getOwnerComponent()?.getEventBus();
            eventBus?.publish("channelHistoryRm", "eventHistoryRm", {
                id: selectedItem.getBindingContext("history")?.getProperty("id")
            });

            router.navTo(route);
        }
    }

    onRatingChange(event: ProductRating$ChangeEvent): void {
        const value = event.getParameter("value");
        const resourceBundle = <ResourceBundle>(<ResourceModel>this?.getView().getModel("i18n"))?.getResourceBundle();

        MessageToast.show(resourceBundle.getText("ratingConfirmation", [value]));
    }
}