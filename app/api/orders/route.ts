import conn from "@/lib/db";
import { canonicalizeData, hashData, signData } from "@/lib/main";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await conn`
        SELECT
            o.id,
            o.product_id,
            o.quantity,
            o.total_price,
            o.hash,
            o.signature,
            o.created_at
        FROM orders AS o
        ORDER BY o.created_at DESC
        `;

        return NextResponse.json(result, { status: 200 });
    } catch (error: unknown) {
        console.error("Loi khi lay danh sach don hang", error);
        return NextResponse.json(
            { success: false, message: "Lay danh sach don hang that bai" },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { productId, quantity } = body;

        if (!productId || !quantity) {
            return NextResponse.json(
                { success: false, message: "Thieu productId hoac quantity" },
                { status: 400 }
            );
        }

        const productResult = await conn`
            SELECT id, name, price FROM products WHERE id = ${productId}
        `;

        if (productResult.length === 0) {
            return NextResponse.json(
                { success: false, message: "San pham khong ton tai" },
                { status: 404 }
            );
        }

        const product = productResult[0];
        const totalPrice = Number(product.price) * quantity;
        const createdAt = Date.now();

        const orderData = {
            productId: productId,
            quantity: quantity,
            totalPrice: totalPrice,
            createdAt: createdAt.toString(),
        };

        const canonicalizedData = canonicalizeData(orderData);
        const hash = hashData(canonicalizedData);

        let signature: string;
        try {
            signature = signData(canonicalizedData);
        } catch (error) {
            console.error("Loi khi ky RSA:", error);
            return NextResponse.json(
                { success: false, message: "Loi xu ly chu ky" },
                { status: 500 }
            );
        }

        const result = await conn`
            INSERT INTO orders (
                product_id,
                quantity,
                total_price,
                created_at,
                hash,
                signature
            )
            VALUES (
                ${productId},
                ${quantity},
                ${totalPrice},
                ${createdAt},
                ${hash},
                ${signature}
            )
            RETURNING id, product_id, quantity, total_price, created_at, hash, signature
        `;

        const order = result[0];

        return NextResponse.json(
            {
                success: true,
                orderId: order.id,
                hash: order.hash,
                signature: order.signature,
                order: {
                    id: order.id,
                    product_id: order.product_id,
                    quantity: order.quantity,
                    total_price: order.total_price,
                    created_at: order.created_at,
                },
            },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Loi khi tao don hang:", error);

        return NextResponse.json(
            {
                success: false,
                message: "Tao don hang that bai",
            },
            { status: 500 }
        );
    }
}
