"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Icon_1 = require("./Icon");
const TooltipControls_1 = require("./TooltipControls");
const React = require("react");
class ToolbarIcon extends React.PureComponent {
    constructor() {
        super(...arguments);
        this.invokeAction = () => {
            const { instanceId, onClick } = this.props;
            if (onClick !== undefined) {
                onClick(instanceId);
            }
        };
    }
    render() {
        const { className, id, text, icon, iconSet, pulse, disabled } = this.props;
        const placement = this.props.placement || 'bottom';
        return (React.createElement(TooltipControls_1.Button, { tooltip: text, id: id, placement: placement, onClick: this.invokeAction, disabled: disabled, className: className },
            React.createElement(Icon_1.default, { set: iconSet, name: icon, pulse: pulse }),
            React.createElement("div", { className: 'button-text' }, text),
            this.props.children));
    }
}
exports.default = ToolbarIcon;
