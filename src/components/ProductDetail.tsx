import {useQuery} from "react-query";
import axios from "axios";

import { Product } from "../entities";



const ProductDetail = ({ productId }: { productId: number }) => {
  // const [product, setProduct] = useState<Product | undefined>(
  //   undefined
  // );
  // const [isLoading, setLoading] = useState(false);
  // const [error, setError] = useState("");
  //
  // useEffect(() => {
  //   if (!productId) {
  //     setError("Invalid ProductId");
  //     return;
  //   }
  //
  //   setLoading(true);
  //   fetch("/products/" + productId)
  //     .then((res) => res.json())
  //     .then((data) => setProduct(data))
  //     .catch((err) => setError((err as Error).message))
  //     .finally(() => setLoading(false));
  // }, []);

  const {data: product, isLoading, error} = useQuery<Product, Error>({
      queryKey: ['product', productId],
      queryFn: () => axios.get<Product>(`/products/${productId}`).then((res) => res.data),
  });

  if(!productId) return <div>Invalid productId</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!product) return <div>The given product was not found.</div>;

  return (
    <div>
      <h1>Product Detail</h1>
      <div>Name: {product.name}</div>
      <div>Price: ${product.price}</div>
    </div>
  );
};

export default ProductDetail;
