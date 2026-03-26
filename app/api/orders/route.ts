import conn from "@/lib/db";
import { NextResponse } from "next/server";

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

        return NextResponse.json(
            result,
            { status: 200 }
        );
    } catch (error: any) {
        console.error("Lỗi khi lấy danh sách đơn hàng", error);
        return NextResponse.json(
            { success: false, message: "Lấy danh sách đơn hàng thất bại", errorDetail: error },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { product_id, quantity } = body;

        if (!product_id || !quantity) {
            return NextResponse.json(
                { success: false, message: "Thiếu product_id hoặc quantity" },
                { status: 400 }
            );
        }
        
        const productResult = await conn`
        SELECT price FROM products WHERE id = ${product_id}
        `;

        if (productResult.length === 0) {
            return NextResponse.json(
                { success: false, message: "Sản phẩm không tồn tại" },
                { status: 404 }
            );
        }

        const price = productResult[0].price;
        const total_price = price * quantity;

        // Tạo đơn hàng
        const result = await conn`
        INSERT INTO orders (product_id, quantity, total_price)
        VALUES (${product_id}, ${quantity}, ${total_price})
        RETURNING id, product_id, quantity, total_price, created_at
        `;

        return NextResponse.json(
            { success: true, order: result[0] },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error("Lỗi khi tạo đơn hàng", error);
        return NextResponse.json(
            { success: false, message: "Tạo đơn hàng thất bại", errorDetail: error },
            { status: 500 }
        );
    }
}