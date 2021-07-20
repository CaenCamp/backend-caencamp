"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppBreadcrumbContextProvider = exports.AppBreadcrumbContext = void 0;
var React = __importStar(require("react"));
var react_1 = require("react");
exports.AppBreadcrumbContext = react_1.createContext({ hasDashboard: false });
var AppBreadcrumbContextProvider = function (_a) {
    var children = _a.children, hasDashboard = _a.hasDashboard;
    var context = react_1.useMemo(function () { return ({ hasDashboard: hasDashboard }); }, [hasDashboard]);
    return (React.createElement(exports.AppBreadcrumbContext.Provider, { value: context }, children));
};
exports.AppBreadcrumbContextProvider = AppBreadcrumbContextProvider;
