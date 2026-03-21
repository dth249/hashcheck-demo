import crypto from "crypto";

export function hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

export function canonicalizeData(data: Record<string, any>): string {
    return JSON.stringify(
        Object.keys(data)
            .sort()
            .reduce((acc, key) => {
                acc[key] = data[key];
                return acc;
            }, {} as Record<string, any>)
    );
}

export function verifySignature(canonicalizedData: string, signature: string) {
    try {
        //Băm dữ liệu
        const verifier = crypto.createVerify('rsa-sha256');
        verifier.update(canonicalizedData);
        verifier.end();

        //Lấy khóa công khai
        const rsa_public_key = process.env.RSA_PUBLIC_KEY!.replace(/\\n/g, '\n');

        //Xác thực chữ ký
        const isValid = verifier.verify(rsa_public_key, signature, 'base64');

        return isValid;
    } catch (error) {
        console.error("Lỗi khi xác thực chữ ký", error);
        return false;
    }
}