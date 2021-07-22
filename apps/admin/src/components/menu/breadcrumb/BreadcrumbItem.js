"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BreadcrumbItem = void 0;
var React = __importStar(require("react"));
var react_router_dom_1 = require("react-router-dom");
var core_1 = require("@material-ui/core");
var app_location_1 = require("../app-location");
var useHasDashboard_1 = require("../app-location/useHasDashboard");
var ra_core_1 = require("ra-core");
var resolveOrReturn = function (valueOrFunction, context) {
    return typeof valueOrFunction === 'function'
        ? valueOrFunction(context)
        : valueOrFunction;
};
/**
 * The <BreadcrumbItem /> is the component used to display the breadcrumb path inside <Breadcrumb />
 *
 * @param {string} name Required. The name of this item which will be used to infer its full path.
 * @param {string} path Internal prop used to build the item full path.
 * @param {function|string} label Required. The label to display for this item.
 * @param {function|string} to Optional. The react-router path to redirect to.
 * @param {boolean} hasDashboard Optional. A boolean indicating whether a dashboard is present. If it is, the dashboard item will be added in the breadcrumb on every pages. You shouldn't have to pass this prop unless you're wrapping the `<BreadcrumbItem>`
 *
 * @see Breadcrumb
 */
var BreadcrumbItem = function (props) {
    var locationMatcher = app_location_1.useAppLocationMatcher();
    var hasDashboard = useHasDashboard_1.useHasDashboard(props);
    var translate = ra_core_1.useTranslate();
    var to = props.to, name = props.name, path = props.path, label = props.label, children = props.children, hasDashboardOverride = props.hasDashboard, rest = __rest(props, ["to", "name", "path", "label", "children", "hasDashboard"]);
    var currentPath = name === app_location_1.DASHBOARD ? '' : "" + (path ? path + "." : '') + name;
    var location = locationMatcher(currentPath);
    if (!location) {
        return null;
    }
    if (name === app_location_1.DASHBOARD && location.path === app_location_1.DASHBOARD) {
        return null;
    }
    var exactMatch = location.path === currentPath;
    var resolvedLabel = resolveOrReturn(label, location.values);
    var translatedLabel = translate(resolvedLabel, { _: resolvedLabel });
    var resolvedTo = resolveOrReturn(to, location.values);
    return (React.createElement(React.Fragment, null,
        React.createElement("li", __assign({ key: name }, rest), resolvedTo && !exactMatch ? (React.createElement(core_1.Link, { variant: "body2", color: "inherit", component: react_router_dom_1.Link, to: resolvedTo }, translatedLabel)) : (React.createElement(core_1.Typography, { variant: "body2", color: "inherit", component: "span" }, translatedLabel))),
        React.Children.map(children, function (child) {
            return React.cloneElement(child, {
                path: currentPath,
                hasDashboard: hasDashboard,
            });
        })));
};
exports.BreadcrumbItem = BreadcrumbItem;
