import conn from "@/lib/db";
import { canonicalizeData, hashData, verifySignature } from "@/lib/main";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const { searchParams } = req.nextUrl;
    const idOrder = searchParams.get("id");

    const resultQuery = await conn`
        SELECT 
            row_to_json(o.*) AS order,
            row_to_json(p.*) AS product
        FROM orders AS o
        JOIN products AS p ON p.id = o.product_id
        WHERE o.id = ${idOrder}
    `;

    if (resultQuery.length === 0) {
        return NextResponse.json(
            { success: false, message: "Đơn hàng không tồn tại" },
            { status: 404 }
        );
    }

    const resultData = resultQuery[0];
    const order = resultData.order;
    const product = resultData.product;

    /*
        Chuẩn hóa dữ liệu của sản phẩm
            - Sắp xếp theo key abc
            - Đưa về dạng chuỗi
    */
    const dataToHash = {
        productId: product.id,
        productPrice: product.price,
        quantity: order.quantity,
        totalPrice: order.total_price,
        createdAt: order.created_at,
    };
    const canonicalProduct = canonicalizeData(dataToHash);

    // Xác thực
    try {
        const isValid = verifySignature(canonicalProduct, order.signature);
        return NextResponse.json({ success: true, orderId: order.id, isValid }, { status: 200 });
    } catch (error) {
        console.error("Lỗi khi xác thực chữ ký", error);
        return NextResponse.json({ success: false, orderId: order.id, isValid: false }, { status: 500 });
    }
}
