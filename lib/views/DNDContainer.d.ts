/// <reference types="react" />
import * as React from 'react';
declare class DNDContainer extends React.Component<{
    style?: React.CSSProperties;
}, {}> {
    static childContextTypes: React.ValidationMap<any>;
    getChildContext(): {
        dragDropManager: any;
    };
    render(): JSX.Element;
}
export default DNDContainer;
