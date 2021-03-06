"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Dropdown_1 = require("../Dropdown");
const ExtensionGate_1 = require("../ExtensionGate");
const Icon_1 = require("../Icon");
const IconBar_1 = require("../IconBar");
const TooltipControls_1 = require("../TooltipControls");
const VisibilityProxy_1 = require("../VisibilityProxy");
const MyTable_1 = require("./MyTable");
const React = require("react");
const react_bootstrap_1 = require("react-bootstrap");
class TableCell extends React.Component {
    constructor() {
        super(...arguments);
        this.cycle = () => {
            const { attribute, rawData } = this.props;
            attribute.edit.onChangeValue(rawData, undefined);
        };
        this.changeCell = (key) => {
            const { attribute, rawData } = this.props;
            attribute.edit.onChangeValue(rawData, key);
        };
        this.renderChoice = (choice) => {
            const { t, attribute, tableId } = this.props;
            return (React.createElement(react_bootstrap_1.MenuItem, { eventKey: choice.key, key: choice.key, className: `option-${tableId}-${attribute.id}-${choice.key}` },
                choice.icon ? React.createElement(Icon_1.default, { name: choice.icon }) : null,
                t(choice.text)));
        };
        this.toggle = () => {
            const { attribute, data, rawData } = this.props;
            const value = data;
            attribute.edit.onChangeValue(rawData, !value);
        };
    }
    shouldComponentUpdate(newProps) {
        return this.props.rawData !== newProps.rawData
            || this.props.data !== newProps.data
            || this.props.language !== newProps.language;
    }
    render() {
        const { t, attribute, container, data, language, onHighlight, rawData, right, rowId, tableId } = this.props;
        // if a custom renderer was set then rowData is the raw object
        // passed to the table by the user.
        // otherwise rowData is the calculated value of this cell
        if (attribute.customRenderer !== undefined) {
            const attrControl = attribute.customRenderer(rawData, false, t, {
                onHighlight
            }) || null;
            return attrControl !== null ? (React.createElement(ExtensionGate_1.default, { id: `extension-${rowId}-${attribute.id}` }, attrControl)) : null;
        }
        if ((data === undefined) || (data === null)) {
            return React.createElement("span", null, ' ');
        }
        else if ((attribute.edit.onChangeValue !== undefined) && attribute.edit.inline) {
            if (attribute.edit.choices !== undefined) {
                const choices = attribute.edit.choices();
                const currentChoice = choices.find(choice => choice.text === data);
                const key = currentChoice !== undefined ? currentChoice.key : undefined;
                return (React.createElement(Dropdown_1.default, { id: `dropdown-${tableId}-${attribute.id}`, container: container, pullRight: right },
                    React.createElement(TooltipControls_1.Button, { id: `btn-${tableId}-${attribute.id}`, className: `btn-${tableId}-${attribute.id}-${key}`, key: key, onClick: this.cycle, onSelect: this.changeCell, tooltip: attribute.description },
                        ((currentChoice !== undefined) && (currentChoice.icon !== undefined))
                            ? React.createElement(Icon_1.default, { name: currentChoice.icon }) : null,
                        currentChoice !== undefined ? t(currentChoice.text) : ''),
                    React.createElement(Dropdown_1.default.Toggle, { className: `toggle-${tableId}-${attribute.id} `
                            + `toggle-${tableId}-${attribute.id}-${key}` }),
                    React.createElement(Dropdown_1.default.Menu, { onSelect: this.changeCell }, choices.filter(choice => choice.visible !== false).map(this.renderChoice))));
            }
        }
        else {
            const cellType = typeof (data);
            if (cellType === 'string') {
                return React.createElement("span", null, data);
            }
            else if (cellType === 'boolean') {
                return (React.createElement(TooltipControls_1.IconButton, { className: 'btn-embed', id: `toggle-${rowId}-${attribute.id}`, tooltip: attribute.name, icon: data ? 'checkbox-checked' : 'square-remove', onClick: this.toggle }));
            }
            else if ((cellType === 'object') && (data instanceof Date)) {
                return (React.createElement("span", null, data !== undefined ? data.toLocaleString(language) : t('Not installed')));
            }
        }
        return React.createElement("span", null, data.toString());
    }
}
class TableRow extends React.Component {
    constructor() {
        super(...arguments);
        this.renderPlaceholder = () => {
            const { data, domRef } = this.props;
            return (React.createElement(MyTable_1.TD, null, '\u00A0'));
        };
        this.renderRow = () => {
            const { actions, attributes, data, domRef, tableId } = this.props;
            if (actions !== undefined) {
                const rowActions = actions.filter((action) => (action.singleRowAction === undefined) || action.singleRowAction);
            }
            const res = attributes.map(this.renderAttribute);
            const sorted = actions
                .filter(icon => {
                try {
                    return (icon.condition === undefined)
                        || icon.condition([data.__id]);
                }
                catch (err) {
                    return false;
                }
            })
                .sort((lhs, rhs) => lhs.position - rhs.position);
            if (sorted.length > 0) {
                const def = sorted[0];
                res.push(React.createElement(MyTable_1.TD, { style: { textAlign: 'center' }, key: 'action-cell', className: `table-${tableId} cell-actions` },
                    React.createElement(IconBar_1.default, { id: `${tableId}-${data.__id}-action-icons`, group: `${tableId}-action-icons`, instanceId: data.__id, className: 'table-actions', staticElements: actions, collapse: true, dropdown: true, pullRight: true })));
            }
            else {
                res.push(React.createElement(MyTable_1.TD, { key: 'no-action' }));
            }
            return res;
        };
        this.selectDefaultAction = (event) => {
            const { actions, data } = this.props;
            const action = actions.find(iter => iter.title === event.currentTarget.value);
            action.action([data.__id]);
        };
        this.selectAction = (eventKey) => {
            const { actions, data } = this.props;
            const action = actions.find(iter => iter.title === eventKey);
            action.action([data.__id]);
        };
        this.renderDefault = (action) => {
            return (React.createElement("div", { className: 'table-default-action' },
                React.createElement(Icon_1.default, { name: action.icon }),
                React.createElement("span", null, action.title)));
        };
        this.renderAttribute = (attribute, index, arr) => {
            const { t, data, rawData, sortAttribute, tableId } = this.props;
            const classes = [
                `table-${tableId}`,
                `cell-${attribute.id}`,
            ];
            if (attribute.id === sortAttribute) {
                classes.push('table-sort-column');
            }
            return (React.createElement(MyTable_1.TD, { className: classes.join(' '), key: attribute.id }, this.renderCell(attribute, rawData, data[attribute.id], t, index >= (arr.length / 2))));
        };
        this.highlight = (highlight) => {
            const { data, onHighlight } = this.props;
            onHighlight(data.__id, highlight);
        };
    }
    shouldComponentUpdate(nextProps) {
        return (this.props.data !== nextProps.data)
            || (this.props.rawData !== nextProps.rawData)
            || (this.props.selected !== nextProps.selected)
            || (this.props.highlighted !== nextProps.highlighted)
            || (this.props.attributes !== nextProps.attributes);
    }
    render() {
        const { data, domRef, highlighted, onClick, selected } = this.props;
        const classes = ['xtr'];
        if (selected) {
            classes.push('table-selected');
        }
        if (highlighted) {
            classes.push('table-highlighted');
        }
        return (React.createElement(VisibilityProxy_1.default, { id: data.__id, key: data.__id, className: classes.join(' '), onClick: onClick, ref: domRef, style: { display: 'table-row' }, startVisible: this.props.initVisible, container: this.props.container, placeholder: this.renderPlaceholder, content: this.renderRow }));
    }
    renderCell(attribute, rawData, calculatedData, t, right) {
        const { container, data, language, tableId } = this.props;
        return (React.createElement(TableCell, { t: t, attribute: attribute, rawData: rawData, data: calculatedData, rowId: data.__id, tableId: tableId, language: language, container: container, onHighlight: this.highlight, right: right }));
    }
}
exports.default = TableRow;
