import { FormProvider, useForm } from "react-hook-form";
import Input from "../../ui/Input";
import Select from "../../ui/Select";
import Button from "../../ui/Button";
import { useReference } from "../../context/ReferenceContext";
import { useCreateProduct } from "./useCreateProduct";
import toast from "react-hot-toast";

export default function AddProductFrom({ close }) {
    const methods = useForm();
    const { createProduct, isCreating } = useCreateProduct()
    const { product_types } = useReference()
    function onSubmit(data) {
        createProduct({
            ...data,
            inStock: 0,
            price: 0,
            status: 'active',
        }, {
            onSuccess: () => {
                close()
                methods.reset()
                toast.success('The Product Successfuly Created ✔!')
            }
        });
    }
    return (
        <div dir='rtl' className='min-w-[95vw] h-[90vh] overflow-y-scroll px-8'>
            <h1 className='mb-8 border-b border-dark w-fit pl-12 pb-2 font-bold text-2xl'>إضافة أوردر</h1>
            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit)} className='px-4'>
                    <Input name='productName' label="إسم المنتج" required={false} />
                    <Input name='sapID' label="كود الساب" required={false} />
                    <Select name='productType' label="الصنف" required={false} options={
                        product_types
                    }
                    />

                    <Button disabled={isCreating} className='mt-12 block' variant='success' size='lg'>Submit</Button>
                </form>
            </FormProvider>
        </div>
    )
}
