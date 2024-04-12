import Skeleton from "react-loading-skeleton";
import {Select} from "@radix-ui/themes";
import {useQuery} from "react-query";
import axios from "axios";
import {Category} from "../entities.ts";

export const CategorySelect = ({onChange}: {onChange: (categoryId: number) => void}) => {
    const {data: categories, isLoading, error} = useQuery({
        queryKey: ['categories'],
        queryFn: () => axios.get<Category[]>('/categories').then((res) => res.data),
    });

    if (isLoading) return <div role="progressbar" aria-label="Loading categories"><Skeleton/></div>;
    // if (errorCategories) return <div>Error: {errorCategories}</div>;
    if (error) return null;
    return (
        <Select.Root
            onValueChange={(categoryId) =>
                onChange(parseInt(categoryId))
            }
        >
            <Select.Trigger placeholder="Filter by Category"/>
            <Select.Content>
                <Select.Group>
                    <Select.Label>Category</Select.Label>
                    <Select.Item value="all">All</Select.Item>
                    {categories?.map((category) => (
                        <Select.Item key={category.id} value={category.id.toString()}>
                            {category.name}
                        </Select.Item>
                    ))}
                </Select.Group>
            </Select.Content>
        </Select.Root>
    );
};
