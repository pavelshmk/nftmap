import { AxiosError } from "axios";
import { toast } from "react-toastify";
import numbro from "numbro";
import { BigNumber } from 'ethers';
import BN from 'bignumber.js';
import Ethers from 'ethers';

numbro.registerLanguage({
    ...numbro.languageData('en-US'),
    languageTag: 'cs',
    delimiters: {
        thousands: ' ',
        decimal: '.',
    },
    defaults: { thousandSeparated: true },
}, true)


export function processRequestError(e: any) {
    console.error(e);
    const data = e.response?.data;
    const ethMessage = e.error?.message;
    if (!data && !ethMessage) {
        toast.error('An error has occurred while performing a request. Please check your internet connection and try later.')
        return;
    }

    if (ethMessage) {
        toast.error(ethMessage.replace('execution reverted: ', ''));
        return;
    }

    if (data?.detail) {
        toast.error(data.detail);
    }

    if (data?.errors) {
        data.errors.forEach((err: { message: string }) => toast.error(err.message));
    } else if (data?.message) {
        toast.error(data.message);
    }

    if (data?.non_field_errors) {
        data.non_field_errors.forEach((err: string) => toast.error(err));
    }

    if (data.length) {
        data.forEach((err) => toast.error(err));
    } else if (typeof data === 'object')
        Object.keys(data).map(key => (data[key].length && data[key].map) && data[key].map((msg: string) => toast.error(msg)));
}

export function fsp(x, trimMantissa = true, mantissa = 2) {
    if (typeof x === 'undefined') return '...';
    x = parseFloat(x) || 0;
    return numbro(x).format({ trimMantissa, mantissa });
}

export function toBNJS(val: BigNumber | number | string) {
    return new BN(val.toString());
}

export function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
