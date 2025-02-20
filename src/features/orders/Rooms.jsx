import { useEffect, useState } from "react";
import Select from "../../ui/Select";
import Input from "../../ui/Input";

const typeOptions = [ //'fabrics', 'cleats', 'accessories'
    [
        { value: "عادي", label: "عادي" },
        { value: "حلق", label: "حلق" },
        { value: "تكسير", label: "تكسير" },
        { value: "ويفي", label: "ويفي" },
        { value: "شوكة", label: "شوكة" },
        { value: "تدكيك", label: "تدكيك" },
        { value: "ايكيا", label: "ايكيا" },
    ],
    [
        { value: "عادي", label: "عادي" },
        { value: "سكوتش", label: "سكوتش" },
    ],
    [
        { value: "احمر", label: "احمر" },
        { value: "برونز", label: "برونز" },
        { value: "فضي", label: "فضي" }
    ]
];

const windowShapes = Array.from({ length: 16 }, (_, i) => ({
    src: `/src/assets/windows/shape-${i + 1}.svg`,
    imageId: i + 1,
}));

export default function Rooms({ methods }) {
    const watchedProducts = methods.watch("products", []);
    const watchedRooms = methods.watch("rooms", []);
    const [selectedRoomIndex, setSelectedRoomIndex] = useState(null);
    const [isWindowPickerOpen, setIsWindowPickerOpen] = useState(false);

    useEffect(() => {
        console.log("Form changed, current rooms:", watchedRooms);
    }, [watchedRooms]);

    const handleAddRoom = () => {
        methods.setValue("rooms", [...watchedRooms, { fabrics: [{}], cleats: [{}], accessories: [{}], windows: [] }]);
    };

    const handleDeleteRoom = (roomIndex) => {
        methods.setValue("rooms", watchedRooms.filter((_, index) => index !== roomIndex));
    };

    const handleAddItem = (roomIndex, field) => {
        const updatedRooms = [...watchedRooms];
        updatedRooms[roomIndex][field].push({});
        methods.setValue("rooms", updatedRooms);
    };

    const handleDeleteItem = (roomIndex, field, itemIndex) => {
        const updatedRooms = [...watchedRooms];
        updatedRooms[roomIndex][field] = updatedRooms[roomIndex][field].filter((_, index) => index !== itemIndex);
        methods.setValue("rooms", updatedRooms);
    };

    const handleAddWindow = (roomIndex) => {
        setSelectedRoomIndex(roomIndex);
        setIsWindowPickerOpen(true);
    };

    const handleSelectWindow = (imageId) => {
        if (selectedRoomIndex !== null) {
            const updatedRooms = [...watchedRooms];
            const selectedWindow = windowShapes.find(win => win.imageId === imageId);
            if (selectedWindow) {
                updatedRooms[selectedRoomIndex].windows.push({ ...selectedWindow, width: "", height: "" });
                methods.setValue("rooms", updatedRooms);
            }
            setIsWindowPickerOpen(false);
        }
    };

    return (
        <>
            <h2 className="text-xl font-bold mb-4">Rooms</h2>
            <div>
                {watchedRooms.map((room, roomIndex) => (
                    <div key={roomIndex} className="flex items-stretch border p-4 mb-4 rounded-lg gap-8">
                        {/* Windows Section */}
                        <div className="w-1/2 bg-gray-100 rounded-lg p-8 max-h-[50vh] overflow-y-scroll">
                            <h4 className="font-medium mb-2">Windows</h4>
                            <button type="button" onClick={() => handleAddWindow(roomIndex)} className="bg-blue-500 text-white px-3 py-1 rounded-md mb-2">
                                + Add Window
                            </button>
                            {room.windows.map((win, winIndex) => (
                                <div key={win.imageId} className="flex items-center gap-4 mb-2">
                                    <img src={win.src} alt={`Window ${win.imageId}`} className="w-16 h-16 border rounded" />
                                    <Input required={true} name={`rooms[${roomIndex}].windows[${winIndex}].width`} label="Width" type="number" />
                                    <Input required={true} name={`rooms[${roomIndex}].windows[${winIndex}].height`} label="Height" type="number" />
                                    <Input required={true} name={`rooms[${roomIndex}].windows[${winIndex}].type`} label="Type" type="text" />
                                    <button type="button" onClick={() => handleDeleteItem(roomIndex, 'windows', winIndex)} className="text-red-500">×</button>
                                </div>
                            ))}
                        </div>

                        {/* Materials Section */}
                        <div className="w-1/2 max-h-[50vh] overflow-y-scroll">
                            <h3 className="font-semibold mb-2">Room {roomIndex + 1}</h3>
                            <button type="button" onClick={() => handleDeleteRoom(roomIndex)} className="text-danger text-sm mb-2 cursor-pointer">Delete Room</button>
                            {['fabrics', 'cleats', 'accessories'].map((category, i) => (
                                <div key={category}>
                                    <h4 className="font-medium mt-2">{category.charAt(0).toUpperCase() + category.slice(1)}</h4>
                                    {room[category].map((_, itemIndex) => (
                                        <div key={itemIndex} className="flex space-x-4 items-center">
                                            <Select required={true} name={`rooms[${roomIndex}].${category}[${itemIndex}].product`} options={watchedProducts.map(p => ({ value: p.product, label: p.product }))} label="Product Name" />
                                            <Input required={true} name={`rooms[${roomIndex}].${category}[${itemIndex}].quantity`} label="Quantity" type="number" step="0.01" min="0" />
                                            <Select required={true} name={`rooms[${roomIndex}].${category}[${itemIndex}].type`} options={typeOptions[i]} label="Type" />
                                            <button type="button" onClick={() => handleDeleteItem(roomIndex, category, itemIndex)} className="text-red-500">×</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => handleAddItem(roomIndex, category)} className="text-blue-500">+ Add {category.charAt(0).toUpperCase() + category.slice(1)}</button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
            {isWindowPickerOpen && (
                <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg max-w-lg">
                        <h3 className="text-lg font-semibold mb-4">Select a Window</h3>
                        <div className="grid grid-cols-4 gap-2">
                            {windowShapes.map(win => (
                                <button key={win.imageId} onClick={() => handleSelectWindow(win.imageId)} className="border p-1 rounded-lg hover:bg-gray-200">
                                    <img src={win.src} alt="" className="w-12 h-12" />
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setIsWindowPickerOpen(false)} className="mt-4 px-4 py-2 bg-red-500 text-white rounded-md">Cancel</button>
                    </div>
                </div>
            )}
            <button type="button" onClick={handleAddRoom} className="mt-4 px-4 py-2 bg-warning text-white rounded-md">+ Add Another Room</button>
        </>
    );
}