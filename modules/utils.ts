import { CIDR_REGEX } from "./constants";

const isCIDR = (target: string): boolean => {
    return (new RegExp(CIDR_REGEX)).test(target) && +target.split('/')[1] <= 128;
}

export { isCIDR };
