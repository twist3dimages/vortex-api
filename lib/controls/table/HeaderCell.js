"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const getAttr_1 = require("../../util/getAttr");
const TooltipControls_1 = require("../TooltipControls");
const MyTable_1 = require("./MyTable");
const SortIndicator_1 = require("./SortIndicator");
const React = require("react");
function nextDirection(direction) {
    switch (direction) {
        case 'asc': return 'desc';
        default: return 'asc';
    }
}
class HeaderCell extends React.Component {
    constructor() {
        super(...arguments);
        this.cycleDirection = () => {
            const { attribute, onSetSortDirection, state } = this.props;
            if (attribute.isSortable) {
                const direction = getAttr_1.default(state, 'sortDirection', 'none');
                onSetSortDirection(attribute.id, nextDirection(direction));
            }
        };
        this.setDirection = (dir) => {
            const { attribute, onSetSortDirection } = this.props;
            onSetSortDirection(attribute.id, dir);
        };
        this.toggleFilter = () => {
            const { attribute, doFilter, onSetFilter } = this.props;
            if (doFilter) {
                onSetFilter(undefined);
            }
            else {
                onSetFilter(attribute.id, null);
            }
        };
    }
    render() {
        const { t, advancedMode, attribute, className, doFilter } = this.props;
        return (React.createElement(MyTable_1.TH, { className: `table-header-cell ${className}`, key: attribute.id },
            React.createElement("div", { style: { display: 'flex', flexDirection: 'column' } },
                React.createElement("div", { className: 'flex-fill', style: { display: 'flex', flexDirection: 'row' }, onClick: this.cycleDirection },
                    React.createElement("p", { style: { margin: 0 } }, t(attribute.name)),
                    React.createElement("div", { style: { whiteSpace: 'nowrap' } }, attribute.isSortable ? this.renderSortIndicator() : null)),
                doFilter ? this.props.children : null)));
    }
    renderSortIndicator() {
        const { state } = this.props;
        const direction = getAttr_1.default(state, 'sortDirection', 'none');
        return (React.createElement(SortIndicator_1.default, { direction: direction, onSetDirection: this.setDirection }));
    }
    renderFilterIndicator() {
        const { t, attribute } = this.props;
        return (React.createElement(TooltipControls_1.IconButton, { id: `btn-filter-${attribute.id}`, className: 'btn-table-filter', icon: 'filter', tooltip: t('Filter'), onClick: this.toggleFilter }));
    }
}
exports.default = HeaderCell;
