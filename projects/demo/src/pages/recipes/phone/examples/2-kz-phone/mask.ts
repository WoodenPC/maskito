import {MaskitoOptions, MaskitoPreprocessor} from '@maskito/core';
import {maskitoCaretGuard, maskitoPrefixPostprocessorGenerator} from '@maskito/kit';

export default {
    mask: [
        '+',
        '7',
        ' ',
        '(',
        /\d/,
        /\d/,
        /\d/,
        ')',
        ' ',
        /\d/,
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
        '-',
        /\d/,
        /\d/,
    ],
    // non-removable country prefix
    postprocessors: [maskitoPrefixPostprocessorGenerator('+7 ')],
    preprocessors: [createCompletePhoneInsertionPreprocessor()],
    plugins: [
        // Forbids to put caret before non-removable country prefix
        // But allows to select all value!
        maskitoCaretGuard((value, [from, to]) => [
            from === to ? '+7 '.length : 0,
            value.length,
        ]),
    ],
} as MaskitoOptions;

// Paste "89123456789" => "+7 (912) 345-67-89"
function createCompletePhoneInsertionPreprocessor(): MaskitoPreprocessor {
    const trimPrefix = (value: string): string => value.replace(/^(\+?7?\s?8?)\s?/, '');
    const countDigits = (value: string): number => value.replace(/\D/g, '').length;

    return ({elementState, data}) => {
        const {value, selection} = elementState;

        return {
            elementState: {
                selection,
                value: countDigits(value) > 11 ? trimPrefix(value) : value,
            },
            data: countDigits(data) >= 11 ? trimPrefix(data) : data,
        };
    };
}
