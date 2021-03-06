/// <reference types="react" />
import Step from './Step';
import * as React from 'react';
export interface IStepsProps {
    step: string;
}
export declare type IProps = React.HTMLAttributes<any> & IStepsProps;
export interface ISteps extends React.ComponentClass<IProps> {
    Step: typeof Step;
}
declare const _default: ISteps;
export default _default;
