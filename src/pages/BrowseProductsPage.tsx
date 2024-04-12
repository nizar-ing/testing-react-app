import {useState} from "react";
import "react-loading-skeleton/dist/skeleton.css";

import {CategorySelect} from "../components/CategorySelect.tsx";
import {ProductTable} from "../components/ProductTable.tsx";

function BrowseProducts() {
    const [selectedCategoryId, setSelectedCategoryId] = useState<
        number | undefined
    >();

    return (
        <div>
            <h1>Products</h1>
            <div className="max-w-xs">
                <CategorySelect onChange={(selectedCategoryId) => setSelectedCategoryId(selectedCategoryId)}/>
            </div>
            <ProductTable categoryId={selectedCategoryId} />
        </div>
    );
}

export default BrowseProducts;
