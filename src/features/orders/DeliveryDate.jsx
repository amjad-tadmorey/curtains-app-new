import Input from "../../ui/Input";
import Table from "../../ui/Table";
import Select from "../../ui/Select";
import { useVehicles } from "./useVehicles";


const columns = [
    { header: "Day", accessor: "date", isSortable: true },
    { header: "vehicle_tagamo", accessor: "vehicle_tagamo", isSortable: true },
    { header: "vehicle_madinaty", accessor: "vehicle_madinaty", isSortable: true },
    { header: "vehicle_90", accessor: "vehicle_90", isSortable: true },
];

const fakeData = [

    {
        date: 'dd/mm/yyyy',
        vehicle_tagamo: 2,
        vehicle_madinaty: 2,
        vehicle_90: 2,
    },
    {
        date: 'dd/mm/yyyy',
        vehicle_tagamo: 2,
        vehicle_madinaty: 2,
        vehicle_90: 2,
    },
    {
        date: 'dd/mm/yyyy',
        vehicle_tagamo: 2,
        vehicle_madinaty: 2,
        vehicle_90: 2,
    },
    {
        date: 'dd/mm/yyyy',
        vehicle_tagamo: 2,
        vehicle_madinaty: 2,
        vehicle_90: 2,
    },

]

export default function DeliveryDate() {
    const { vehicles, isLoading } = useVehicles()

    if (isLoading) return null
    let vehiclesOptions = []
    vehicles.forEach((el) => {
        vehiclesOptions.push({
            key: el.id,
            value: el.id,
            label: el.vehicl_name
        })

    })

    return (
        <div className="pb-4 py-6 border-b border-gray-300">

            <h2 className="text-xl font-bold mb-4">تحديد موعد التسليم : </h2>

            <div className="flex items-center gap-6">
                <Input name='delivery_date' label="تاريخ التسليم" required={true} type='date' />
                <Select required={true} name='vehicle' options={vehiclesOptions} label="إسم العربية" />
            </div>
            {/* <Table
                name={'delivery-date'}
                columns={columns}
                data={fakeData}
                rowsPerPage={99999999999999999999} // Customize pagination
            /> */}
        </div>
    )
}
