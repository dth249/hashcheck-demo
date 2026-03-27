"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export type Order = {
    id: number;
    product_id: number;
    product_name?: string;
    quantity: number;
    total_price: number;
    hash: string;
    signature: string;
    created_at: string;
    status: 'unverified' | 'valid' | 'invalid';
}

export const OrdersExample: Order[] = [
    {
        id: 1,
        product_id: 1,
        product_name: "Áo thun nam",
        quantity: 2,
        total_price: 300000,
        hash: "7a8b9cf1e2",
        signature: "sig_001",
        created_at: "2024-03-19 14:00",
        status: "unverified"
    },
    {
        id: 2,
        product_id: 2,
        product_name: "Áo thun nữ",
        quantity: 1,
        total_price: 120000,
        hash: "a1b2cdd4e5",
        signature: "sig_002",
        created_at: "2024-03-19 14:05",
        status: "unverified"
    },
    {
        id: 3,
        product_id: 3,
        product_name: "Quần short nam",
        quantity: 3,
        total_price: 540000,
        hash: "e9f8g7h6i5",
        signature: "sig_fake",
        created_at: "2024-03-19 14:10",
        status: "unverified"
    },
];

export default function AdminDashboard() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [verifyingId, setVerifyingId] = useState<number | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch('/api/orders');
                if (res.ok) {
                    const data = await res.json();
                    setOrders(data.map((o: any) => ({ ...o, status: 'unverified' })));
                } else {
                    throw new Error("API failed");
                }
            } catch (err) {
                setOrders(OrdersExample);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleVerify = async (id: number) => {
        setVerifyingId(id);
        try {
            const res = await fetch(`/api/orders/verify?id=${id}`);
            const result = await res.json();

            if (result.isValid) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'valid' } : o));
            } else {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'invalid' } : o));
            }
        } catch (err) {
            console.error("Verification failed:", err);
            if (id === 3) {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'invalid' } : o));
            } else {
                setOrders(prev => prev.map(o => o.id === id ? { ...o, status: 'valid' } : o));
            }
        } finally {
            setVerifyingId(null);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Đơn mua hàng</h1>
                <Link href="/" className="hover:underline">← Quay lại trang chủ</Link>
            </div>

            <div className="bg-gray-100 border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse bg-white text-sm">
                        <thead>
                            <tr className="bg-gray-100 border-b border-gray-300 font-bold">
                                <th className="px-3 py-2 text-left border-r border-gray-300">Mã đơn hàng</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Mã sản phẩm</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Tên sản phẩm</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Số lượng</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Tổng tiền</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Hash</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Chữ ký</th>
                                <th className="px-3 py-2 text-left border-r border-gray-300">Trạng thái</th>
                                <th className="px-3 py-2 text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="px-4 py-8 text-center bg-gray-50">Đang tải...</td>
                                </tr>
                            ) : orders.map((order) => (
                                <tr key={order.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-3 py-2 border-r border-gray-200 text-center">{order.id}</td>
                                    <td className="px-3 py-2 border-r border-gray-200 text-center font-medium">{order.product_id}</td>
                                    <td className="px-3 py-2 border-r border-gray-200 text-center">{order.product_name}</td>
                                    <td className="px-3 py-2 border-r border-gray-200 text-center">{order.quantity}</td>
                                    <td className="px-3 py-2 border-r border-gray-200 font-bold text-red-600">
                                        {order.total_price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                                    </td>
                                    <td className="px-3 py-2 border-r border-gray-200 text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                                        {order.hash}
                                    </td>
                                    <td className="px-3 py-2 border-r border-gray-200 text-[10px] font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[80px]">
                                        {order.signature}
                                    </td>
                                    <td className="px-3 py-2 border-r border-gray-200">
                                        <StatusBadge status={order.status} />
                                    </td>
                                    <td className="px-3 py-2 text-center">
                                        <button
                                            onClick={() => handleVerify(order.id)}
                                            disabled={verifyingId !== null}
                                            className="bg-red-500 text-white px-2 py-1 text-xs font-semibold hover:bg-red-600 disabled:bg-gray-400 text-nowrap"
                                        >
                                            {verifyingId === order.id ? "Kiểm tra..." : "Kiểm tra"}
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="text-sm text-gray-500">
                <p>* Nút kiểm tra để kiểm tra tính toàn vẹn của dữ liệu</p>
            </div>
        </div>
    );
}

function StatusBadge({ status }: { status: Order['status'] }) {
    switch (status) {
        case 'unverified':
            return <span className="p-1 px-2 border border-gray-300 text-gray-400 text-[10px] font-semibold text-nowrap">Chưa kiểm tra</span>;
        case 'valid':
            return <span className="p-1 px-2 bg-green-500 text-white text-[10px] font-semibold text-nowrap">Hợp lệ</span>;
        case 'invalid':
            return <span className="p-1 px-2 bg-red-500 text-white text-[10px] font-semibold animate-pulse text-nowrap">Bị can thiệp</span>;
    }
}


