import {MaskitoOptions} from '@maskito/core';

import {CHAR_MINUS} from '../../../constants';

/**
 * It pads integer part with zero if user types decimal separator (for empty input).
 * @example Empty input => User types "," (decimal separator) => 0,|
 */
export function createNotEmptyIntegerPartPreprocessor({
    decimalSeparator,
    precision,
}: {
    decimalSeparator: string;
    precision: number;
}): NonNullable<MaskitoOptions['preprocessor']> {
    const startWithDecimalSepRegExp = new RegExp(`^\\D*\\${decimalSeparator}`);

    return ({elementState, data}) => {
        const {value, selection} = elementState;
        const [from] = selection;

        if (
            precision <= 0 ||
            value.includes(decimalSeparator) ||
            !data.match(startWithDecimalSepRegExp)
        ) {
            return {elementState, data};
        }

        const valueBeforeCursor = value.slice(0, from);

        return {
            elementState,
            data:
                valueBeforeCursor && valueBeforeCursor !== CHAR_MINUS ? data : `0${data}`,
        };
    };
}
