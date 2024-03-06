"use client";
import { useRouter,useParams } from 'next/navigation';


const ProductPage = ({ params }: { params: { productId: string } }) => {
  const router = useRouter();
  const { productId } = useParams()

  // Render product details
  return (
    <div>
      <p>{productId}</p>
      {/* <h1>{product.itemName}</h1>
      <p>{product.itemTitle}</p> */}
      {/* Render other product details */}
    </div>
  );
};



export default ProductPage;
