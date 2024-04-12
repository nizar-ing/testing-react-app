/*import axios, { AxiosError} from "axios";*/

import axios from 'axios';
import { Product } from "../entities";
import {useQuery} from "react-query";

const ProductList = () => {

  // const [products, setProducts] = useState<Product[]>([]);
  // const [isLoading, setLoading] = useState(false);
  // const [error, setError] = useState("");*/
  //
  // /*useEffect(() => {
  //   const fetchProducts = async () => {
  //     try {
  //       setLoading(true);
  //       const { data } = await axios.get("/products");
  //       setProducts(data);
  //       setLoading(false);
  //     } catch (error) {
  //       setLoading(false);
  //       if (error instanceof AxiosError) setError(error.message);
  //       else setError("An unexpected error occurred");
  //     }
  //   };
  //   fetchProducts();
  // }, []);

  const {data: products, isLoading, error} = useQuery<Product[], Error>({
    queryKey: ['products'],
    queryFn: () => axios.get<Product[]>("/products").then((res) => res.data),
  });

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>Error: {error.message}</div>;

  if (products?.length === 0) return <p>No products available.</p>;

  return (
    <ul>
      {products?.map((product) => (
        <li key={product.id}>{product.name}</li>
      ))}
    </ul>
  );
};

export default ProductList;
