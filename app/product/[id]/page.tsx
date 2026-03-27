"use client";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/components/Products";

export default function ProductDetail() {
    const params = useParams();
    const id = Number(params.id);
    const [quantity, setQuantity] = useState(1);
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/products/${id}`)
            .then((res) => res.json())
            .then((data) => setProduct(data.product))
            .finally(() => setLoading(false));
    }, [id]);

    const handleQuantityChange = (amount: number) => {
        setQuantity((prev) => Math.max(1, prev + amount));
    }
    const handleBuy = () => {
        fetch("/api/orders", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                productId: id,
                quantity: quantity,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                if (data.success) {
                    alert("Đặt đơn hàng thành công");
                } else {
                    alert(data.message);
                }
            })
    }

    if (loading) {
        return (
            <div className="flex flex-col gap-6">
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 border border-gray-200 animate-pulse">
                    {/* Ảnh */}
                    <div className="w-full aspect-square bg-gray-200" />
                    {/* Thông tin */}
                    <div className="flex flex-col gap-4">
                        <div className="h-8 bg-gray-200 rounded w-2/3" />
                        <div className="h-px bg-gray-300" />
                        <div className="flex flex-col gap-2">
                            <div className="flex gap-2">
                                <div className="w-10 h-10 bg-gray-200 rounded" />
                                <div className="w-12 h-10 bg-gray-200 rounded" />
                                <div className="w-10 h-10 bg-gray-200 rounded" />
                            </div>
                        </div>
                        <div className="h-12 bg-gray-200 rounded" />
                        <div className="h-px bg-gray-300" />
                        <div className="flex flex-col gap-2">
                            <div className="h-3 bg-gray-200 rounded w-32" />
                            <div className="h-3 bg-gray-200 rounded w-full" />
                            <div className="h-3 bg-gray-200 rounded w-5/6" />
                            <div className="h-3 bg-gray-200 rounded w-4/6" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="flex flex-col gap-4">
                <Link href="/" className="hover:underline">← Quay lại</Link>
                <div className="p-8 bg-gray-100 border border-gray-300 text-center">
                    <p className="text-xl">Không tìm thấy sản phẩm</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6">
            <Link href="/" className="hover:underline">← Quay lại</Link>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-100 border border-gray-200">
                <div className="w-full aspect-square relative border border-gray-200 bg-white">
                    <Image
                        src={product.img_url}
                        alt={product.name}
                        fill
                        className="object-cover"
                    />
                </div>

                <div className="flex flex-col gap-4">
                    <h1 className="text-3xl font-bold">{product.name}</h1>
                    <p className="text-2xl text-red-500 font-bold">
                        {product.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
                    </p>

                    <div className="h-px bg-gray-300 my-2"></div>

                    <div>
                        <p className="mb-2 text-sm">Số lượng:</p>
                        <div className="flex items-center gap-2">
                            <button className="w-10 h-10 border border-gray-300 cursor-pointer" onClick={() => handleQuantityChange(-1)}>-</button>
                            <input type="text" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-12 h-10 text-center border-none outline-none" />
                            <button className="w-10 h-10 border border-gray-300 cursor-pointer" onClick={() => handleQuantityChange(1)}>+</button>
                        </div>
                    </div>

                    <div className="mt-auto pt-6 flex flex-col sm:flex-row gap-3">
                        <button className="flex-1 bg-red-500 text-white font-bold py-3 px-6 hover:bg-red-600 transition-colors" onClick={handleBuy}>
                            MUA NGAY
                        </button>
                    </div>

                    <div className="h-px bg-gray-300 my-2"></div>

                    <div className="text-gray-700 leading-relaxed">
                        <p className="font-semibold mb-2">Mô tả sản phẩm:</p>
                        <p>{product.description}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
