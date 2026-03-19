"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Products() {
    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        setProducts(ProductsExample);
    }, []);

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Products</h1>
            <div className="flex gap-4 p-4 bg-gray-100 border border-gray-200">
                {products.map((product) => (
                    <div className="p-2 border-2" key={`${product.id}-${product.name}`}>
                        <Image src={`https://picsum.photos/300/300?random=${product.id}`} alt={product.name} width={100} height={100} />
                        <p>{product.name}</p>
                        <p>{product.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}


type Product = {
    id: number;
    name: string;
    price: number;
}

const ProductsExample: Product[] = [
    {
        id: 1,
        name: "Áo thun nam",
        price: 150000,
    },
    {
        id: 2,
        name: "Áo thun nữ",
        price: 120000,
    },
    {
        id: 3,
        name: "Quần short nam",
        price: 180000,
    },
];