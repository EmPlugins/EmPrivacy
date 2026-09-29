const PLC_DID_RE = /^did:plc:([a-z2-7]{24})$/;
/** checks if input is a did:plc identifier */
export const isPlcDid = (input) => {
    return typeof input === 'string' && input.length === 32 && PLC_DID_RE.test(input);
};
