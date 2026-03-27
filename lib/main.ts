import crypto from "crypto";

export function hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

export function canonicalizeData(data: Record<string, unknown>): string {
    return JSON.stringify(
        Object.keys(data)
            .sort()
            .reduce((acc, key) => {
                acc[key] = data[key];
                return acc;
            }, {} as Record<string, any>)
    );
}

export function signData(canonicalizedData: string): string {
    const signer = crypto.createSign('rsa-sha256');
    signer.update(canonicalizedData);
    signer.end();

    const rsa_private_key = process.env.RSA_PRIVATE_KEY!.replace(/\\n/g, '\n');
    const signature = signer.sign(rsa_private_key, 'base64');
    return signature;
}

export function verifySignature(canonicalizedData: string, signature: string) {
    //Băm dữ liệu
    const verifier = crypto.createVerify('rsa-sha256');
    verifier.update(canonicalizedData);
    verifier.end();

    //Lấy khóa công khai
    const rsa_public_key = process.env.RSA_PUBLIC_KEY!.replace(/\\n/g, '\n');

    //Xác thực chữ ký
    const isValid = verifier.verify(rsa_public_key, signature, 'base64');

    return isValid;
}

export function getPrivateKey(): string {
    const privateKey = process.env.RSA_PRIVATE_KEY;
    if (!privateKey) {
        throw new Error('RSA_PRIVATE_KEY không được cấu hình');
    }
    return privateKey.replace(/\\n/g, '\n');
}