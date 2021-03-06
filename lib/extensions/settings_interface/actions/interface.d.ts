import * as reduxAct from 'redux-act';
/**
 * change the user interface language
 */
export declare const setLanguage: reduxAct.ComplexActionCreator1<{}, {}, {}>;
/**
 * enable or disable advanced mode
 */
export declare const setAdvancedMode: reduxAct.ComplexActionCreator1<boolean, {
    advanced: boolean;
}, {}>;
export declare const setProfilesVisible: reduxAct.ComplexActionCreator1<boolean, {
    visible: boolean;
}, {}>;
